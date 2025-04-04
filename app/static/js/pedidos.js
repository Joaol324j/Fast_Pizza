document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando...');
    
    const newOrderBtn = document.getElementById('newOrderBtn');
    const newOrderModal = document.getElementById('newOrderModal');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeButtons = document.querySelectorAll('.close');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    
    console.log('Elementos encontrados:', {
        newOrderBtn: !!newOrderBtn,
        newOrderModal: !!newOrderModal,
        editModal: !!editModal,
        deleteModal: !!deleteModal,
        closeButtons: closeButtons.length,
        ordersTableBody: !!ordersTableBody,
        confirmDeleteBtn: !!confirmDeleteBtn,
        cancelDeleteBtn: !!cancelDeleteBtn
    });
    
    if (!newOrderBtn) {
        console.error('Botão de novo pedido não encontrado');
        return;
    }
    
    if (!newOrderModal) {
        console.error('Modal de novo pedido não encontrado');
        return;
    }
    
    if (!ordersTableBody) {
        console.error('Tabela de pedidos não encontrada');
        return;
    }
    
    newOrderBtn.addEventListener('click', function() {
        console.log('Botão de novo pedido clicado');
        newOrderModal.classList.add('active');
        loadMenuItems();
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Botão de fechar clicado');
            newOrderModal.classList.remove('active');
            editModal.classList.remove('active');
            deleteModal.classList.remove('active');
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === newOrderModal) {
            console.log('Clicou fora do modal');
            newOrderModal.classList.remove('active');
        }
        if (event.target === editModal) {
            console.log('Clicou fora do modal de edição');
            editModal.classList.remove('active');
        }
        if (event.target === deleteModal) {
            console.log('Clicou fora do modal de exclusão');
            deleteModal.classList.remove('active');
        }
    });
    
    async function loadMenuItems() {
        try {
            console.log('Carregando itens do menu...');
            const response = await fetch('/api/menu/');
            console.log('Resposta recebida:', response.status);
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar itens do menu: ${response.status}`);
            }
            
            const items = await response.json();
            console.log('Itens carregados:', items);
            
            const itemsSelect = document.getElementById('items');
            if (!itemsSelect) {
                throw new Error('Elemento items não encontrado');
            }
            
            itemsSelect.innerHTML = '';
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
                itemsSelect.appendChild(option);
            });
            
            console.log('Itens adicionados ao select');
        } catch (error) {
            console.error('Erro ao carregar itens:', error);
            alert('Erro ao carregar itens do menu. Por favor, tente novamente.');
        }
    }
    
    const itemsSelect = document.getElementById('items');
    if (itemsSelect) {
        itemsSelect.addEventListener('change', function() {
            const selectedItems = Array.from(this.selectedOptions);
            const total = selectedItems.reduce((sum, option) => {
                const price = parseFloat(option.textContent.split('R$ ')[1]);
                return sum + price;
            }, 0);
            document.getElementById('totalAmount').value = total.toFixed(2);
        });
    }
    
    const newOrderForm = document.getElementById('newOrderForm');
    if (newOrderForm) {
        newOrderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Enviando novo pedido...');
            
            const selectedItems = Array.from(document.getElementById('items').selectedOptions);
            const produtos = selectedItems.map(option => ({
                produto_id: parseInt(option.value),
                quantidade: 1
            }));
            
            console.log('Dados do pedido:', { produtos });
            
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                    console.log('Token adicionado explicitamente à requisição de criação');
                } else {
                    console.warn('Token não encontrado, requisição pode falhar por falta de autorização');
                }
                
                const response = await fetch('/api/pedidos/', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ produtos })
                });
                
                console.log('Resposta do servidor:', response.status);
                
                if (!response.ok) {
                    if (response.status === 401) {
                        console.error('Erro de autenticação. Redirecionando para login...');
                        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                        return;
                    }
                    
                    const error = await response.json();
                    throw new Error(error.detail || 'Erro ao criar pedido');
                }
                
                const data = await response.json();
                console.log('Pedido criado com sucesso:', data);
                
                newOrderModal.classList.remove('active');
                loadOrders();
            } catch (error) {
                console.error('Erro:', error);
                const errorMessage = document.getElementById('errorMessage');
                if (errorMessage) {
                    errorMessage.textContent = error.message;
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
    
    async function loadOrders() {
        try {
            console.log('Carregando pedidos...');
            const response = await fetch('/api/pedidos/');
            console.log('Resposta recebida:', response.status);
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar pedidos: ${response.status}`);
            }
            
            const orders = await response.json();
            console.log('Pedidos carregados:', orders);
            
            ordersTableBody.innerHTML = '';
            
            if (!orders || orders.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="5" style="text-align: center;">Nenhum pedido encontrado</td>';
                ordersTableBody.appendChild(row);
                return;
            }

            orders.forEach(order => {
                try {
                    const row = document.createElement('tr');
                    row.dataset.orderId = order.id;
                    
                    const statusClass = `status-${order.status ? order.status.replace(' ', '_') : 'pendente'}`;
                    
                    const total = order.total ? order.total.toFixed(2) : '0.00';
                    
                    row.innerHTML = `
                        <td>R$ ${total}</td>
                        <td><span class="status-badge ${statusClass}">${order.status || 'pendente'}</span></td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editOrder(${order.id || 0})">Editar</button>
                            <button class="action-btn delete-btn" onclick="deleteOrder(${order.id || 0})">Excluir</button>
                        </td>
                    `;
                    
                    ordersTableBody.appendChild(row);
                } catch (error) {
                    console.error('Erro ao processar pedido:', order, error);
                }
            });
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: red;">
                        Erro ao carregar pedidos: ${error.message}
                    </td>
                </tr>
            `;
        }
    }
    
    window.editOrder = async function(orderId) {
        try {
            console.log('Editando pedido:', orderId);
            const response = await fetch(`/api/pedidos/${orderId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar pedido');
            }
            
            const order = await response.json();
            console.log('Pedido carregado:', order);
            
            document.getElementById('editOrderId').value = order.id;
            document.getElementById('editStatus').value = order.status;
            
            editModal.classList.add('active');
        } catch (error) {
            console.error('Erro ao carregar pedido:', error);
            alert('Erro ao carregar pedido. Por favor, tente novamente.');
        }
    };
    
    let orderToDelete = null;

    window.deleteOrder = function(id) {
        console.log('Iniciando exclusão do pedido:', id);
        orderToDelete = id;
        deleteModal.classList.add('active');
    };

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function() {
            console.log('Confirmando exclusão do pedido:', orderToDelete);
            if (orderToDelete) {
                try {
                    const token = localStorage.getItem('token');
                    const headers = {};
                    
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                        console.log('Token adicionado explicitamente à requisição de exclusão');
                    } else {
                        console.warn('Token não encontrado, requisição pode falhar por falta de autorização');
                    }
                    
                    const response = await fetch(`/api/pedidos/${orderToDelete}`, {
                        method: 'DELETE',
                        headers: headers
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            console.error('Erro de autenticação. Redirecionando para login...');
                            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                            return;
                        }
                        throw new Error('Erro ao excluir pedido');
                    }

                    console.log('Pedido excluído com sucesso');
                    deleteModal.classList.remove('active');
                    loadOrders();
                    orderToDelete = null;
                } catch (error) {
                    console.error('Erro ao excluir pedido:', error);
                    alert('Erro ao excluir pedido. Por favor, tente novamente.');
                }
            }
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            console.log('Cancelando exclusão');
            deleteModal.classList.remove('active');
            orderToDelete = null;
        });
    }
    
    const editOrderForm = document.getElementById('editOrderForm');
    if (editOrderForm) {
        editOrderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Enviando atualização de status...');

            const orderId = document.getElementById('editOrderId').value;
            const novoStatus = document.getElementById('editStatus').value;
            const token = localStorage.getItem('token');

            try {
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                    console.log('Token adicionado explicitamente à requisição de atualização de status');
                } else {
                    console.warn('Token não encontrado, requisição pode falhar por falta de autorização');
                }

                const response = await fetch(`/api/pedidos/${orderId}/status`, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify({ status: novoStatus })
                });

                console.log('Resposta do servidor:', response.status);

                if (!response.ok) {
                    if (response.status === 401) {
                        console.error('Erro de autenticação. Redirecionando para login...');
                        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                        return;
                    }
                    
                    const error = await response.json();
                    throw new Error(error.detail || 'Erro ao atualizar status');
                }

                const data = await response.json();
                console.log('Status atualizado com sucesso:', data);

                const editModal = document.getElementById('editModal');
                if (editModal) {
                    editModal.classList.remove('active');
                }
                
                loadOrders();
            } catch (error) {
                console.error('Erro:', error);
                const errorMessage = document.getElementById('editErrorMessage');
                if (errorMessage) {
                    errorMessage.textContent = error.message;
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
    
    loadOrders();
}); 