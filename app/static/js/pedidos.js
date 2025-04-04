document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando...');
    
    const newOrderBtn = document.getElementById('newOrderBtn');
    const newOrderModal = document.getElementById('newOrderModal');
    const editModal = document.getElementById('editModal');
    const closeButtons = document.querySelectorAll('.close');
    const ordersTableBody = document.getElementById('ordersTableBody');
    
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
        newOrderModal.style.display = 'block';
        loadMenuItems();
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Botão de fechar clicado');
            newOrderModal.style.display = 'none';
            if (editModal) {
                editModal.style.display = 'none';
            }
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === newOrderModal) {
            console.log('Clicou fora do modal');
            newOrderModal.style.display = 'none';
        }
        if (event.target === editModal) {
            console.log('Clicou fora do modal de edição');
            editModal.style.display = 'none';
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
                const response = await fetch('/api/pedidos/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ produtos })
                });
                
                console.log('Resposta do servidor:', response.status);
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || 'Erro ao criar pedido');
                }
                
                const data = await response.json();
                console.log('Pedido criado com sucesso:', data);
                
                newOrderModal.style.display = 'none';
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
            
            editModal.style.display = 'block';
        } catch (error) {
            console.error('Erro ao carregar pedido:', error);
            alert('Erro ao carregar pedido. Por favor, tente novamente.');
        }
    };
    
    window.deleteOrder = async function(orderId) {
        if (confirm('Tem certeza que deseja excluir este pedido?')) {
            try {
                console.log('Excluindo pedido:', orderId);
                const response = await fetch(`/api/pedidos/${orderId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao excluir pedido');
                }
                
                loadOrders();
            } catch (error) {
                console.error('Erro ao excluir pedido:', error);
                alert('Erro ao excluir pedido. Por favor, tente novamente.');
            }
        }
    };
    
    const editOrderForm = document.getElementById('editOrderForm');
    if (editOrderForm) {
        editOrderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Enviando atualização de status...');

            const orderId = document.getElementById('editOrderId').value;
            const novoStatus = document.getElementById('editStatus').value;

            try {
                const response = await fetch(`/api/pedidos/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: novoStatus })
                });

                console.log('Resposta do servidor:', response.status);

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || 'Erro ao atualizar status');
                }

                const data = await response.json();
                console.log('Status atualizado com sucesso:', data);

                const editModal = document.getElementById('editModal');
                if (editModal) {
                    editModal.style.display = 'none';
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