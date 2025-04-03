document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const orderForm = document.getElementById('order-form');
    const addProductBtn = document.getElementById('add-product-btn');
    const productList = document.getElementById('product-list');
    const ordersTableBody = document.getElementById('orders-table-body');
    const loadingOrders = document.getElementById('loading-orders');
    const errorOrders = document.getElementById('error-orders');
    const errorOrder = document.getElementById('error-order');
    const successOrder = document.getElementById('success-order');
    const loadingOrder = document.getElementById('loading-order');
    
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const saveEditBtn = document.getElementById('save-edit');
    const editForm = document.getElementById('edit-form');
    const editOrderIdInput = document.getElementById('edit-order-id');
    const editStatusSelect = document.getElementById('edit-status');
    const editProductList = document.getElementById('edit-product-list');
    const addEditProductBtn = document.getElementById('add-edit-product-btn');
    const errorEdit = document.getElementById('error-edit');
    const successEdit = document.getElementById('success-edit');
    const loadingEdit = document.getElementById('loading-edit');
    
    let menuItems = [];
    let currentOrder = null;
    
    loadOrders();
    loadMenuItems();
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    addProductBtn.addEventListener('click', function() {
        addProductItem(productList);
    });
    
    addEditProductBtn.addEventListener('click', function() {
        addProductItem(editProductList);
    });
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createOrder();
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);
    saveEditBtn.addEventListener('click', updateOrder);
    
    window.onclick = function(event) {
        if (event.target === editModal) {
            closeModal();
        }
    };
    
    async function loadOrders() {
        try {
            loadingOrders.style.display = 'block';
            errorOrders.style.display = 'none';
            
            const response = await fetch('/api/pedidos');
            if (!response.ok) {
                throw new Error('Erro ao carregar pedidos');
            }
            
            const orders = await response.json();
            displayOrders(orders);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            errorOrders.textContent = error.message;
            errorOrders.style.display = 'block';
        } finally {
            loadingOrders.style.display = 'none';
        }
    }
    
    async function loadMenuItems() {
        try {
            const response = await fetch('/api/menu');
            if (!response.ok) {
                throw new Error('Erro ao carregar itens do menu');
            }
            
            menuItems = await response.json();
        } catch (error) {
            console.error('Erro ao carregar itens do menu:', error);
        }
    }
    
    function displayOrders(orders) {
        ordersTableBody.innerHTML = '';
        
        if (orders.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">Nenhum pedido encontrado</td>';
            ordersTableBody.appendChild(row);
            return;
        }
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            
            const date = new Date(order.data_criacao);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            let statusClass = 'status-pendente';
            if (order.status === 'em-preparo') statusClass = 'status-em-preparo';
            else if (order.status === 'concluido') statusClass = 'status-concluido';
            else if (order.status === 'cancelado') statusClass = 'status-cancelado';
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${formattedDate}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>R$ ${parseFloat(order.total).toFixed(2)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editOrder(${order.id})">Editar</button>
                    <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})">Excluir</button>
                </td>
            `;
            
            ordersTableBody.appendChild(row);
        });
    }
    
    function addProductItem(container, product = null, quantity = 1) {
        if (menuItems.length === 0) {
            alert('Carregando itens do menu. Por favor, aguarde um momento e tente novamente.');
            return;
        }
        
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        const productSelect = document.createElement('select');
        productSelect.className = 'product-select';
        productSelect.required = true;
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecione um produto';
        productSelect.appendChild(defaultOption);
        
        menuItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.nome} - R$ ${parseFloat(item.preco).toFixed(2)}`;
            if (product && product.produto_id === item.id) {
                option.selected = true;
            }
            productSelect.appendChild(option);
        });
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = '1';
        quantityInput.value = quantity;
        quantityInput.required = true;
        quantityInput.className = 'product-quantity';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-product-btn';
        removeBtn.textContent = 'X';
        removeBtn.onclick = function() {
            container.removeChild(productItem);
        };
        
        productItem.appendChild(productSelect);
        productItem.appendChild(quantityInput);
        productItem.appendChild(removeBtn);
        
        container.appendChild(productItem);
    }
    
    async function createOrder() {
        try {
            loadingOrder.style.display = 'block';
            errorOrder.style.display = 'none';
            successOrder.style.display = 'none';
            
            const productItems = document.querySelectorAll('.product-item');
            const produtos = [];
            
            productItems.forEach(item => {
                const produtoId = parseInt(item.querySelector('.product-select').value);
                const quantidade = parseInt(item.querySelector('.product-quantity').value);
                
                if (produtoId && quantidade) {
                    produtos.push({
                        produto_id: produtoId,
                        quantidade: quantidade
                    });
                }
            });
            
            if (produtos.length === 0) {
                throw new Error('Adicione pelo menos um produto ao pedido');
            }
            
            const orderData = {
                produtos: produtos
            };
            
            const response = await fetch('/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao criar pedido');
            }
            
            orderForm.reset();
            productList.innerHTML = '';
            
            successOrder.textContent = 'Pedido criado com sucesso!';
            successOrder.style.display = 'block';
            
            loadOrders();
            
            document.querySelector('[data-tab="list-orders"]').click();
            
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            errorOrder.textContent = error.message;
            errorOrder.style.display = 'block';
        } finally {
            loadingOrder.style.display = 'none';
        }
    }
    
    window.editOrder = async function(orderId) {
        try {
            loadingEdit.style.display = 'block';
            errorEdit.style.display = 'none';
            successEdit.style.display = 'none';
            
            const response = await fetch(`/api/pedidos/${orderId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar pedido');
            }
            
            currentOrder = await response.json();
            
            editOrderIdInput.value = currentOrder.id;
            editStatusSelect.value = currentOrder.status;
            
            editProductList.innerHTML = '';
            
            if (currentOrder.produtos && currentOrder.produtos.length > 0) {
                currentOrder.produtos.forEach(produto => {
                    addProductItem(editProductList, produto, produto.quantidade);
                });
            }
            
            editModal.style.display = 'block';
            
        } catch (error) {
            console.error('Erro ao carregar pedido para edição:', error);
            errorEdit.textContent = error.message;
            errorEdit.style.display = 'block';
        } finally {
            loadingEdit.style.display = 'none';
        }
    };
    
    function closeModal() {
        editModal.style.display = 'none';
        editForm.reset();
        editProductList.innerHTML = '';
        currentOrder = null;
    }
    
    async function updateOrder() {
        try {
            loadingEdit.style.display = 'block';
            errorEdit.style.display = 'none';
            successEdit.style.display = 'none';
            
            const orderId = editOrderIdInput.value;
            const status = editStatusSelect.value;
            
            const productItems = editProductList.querySelectorAll('.product-item');
            const produtos = [];
            
            productItems.forEach(item => {
                const produtoId = parseInt(item.querySelector('.product-select').value);
                const quantidade = parseInt(item.querySelector('.product-quantity').value);
                
                if (produtoId && quantidade) {
                    produtos.push({
                        produto_id: produtoId,
                        quantidade: quantidade
                    });
                }
            });
            
            if (produtos.length === 0) {
                throw new Error('Adicione pelo menos um produto ao pedido');
            }
            
            const statusResponse = await fetch(`/api/pedidos/${orderId}/status?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!statusResponse.ok) {
                throw new Error('Erro ao atualizar status do pedido');
            }
            
            
            successEdit.textContent = 'Pedido atualizado com sucesso!';
            successEdit.style.display = 'block';
            
            setTimeout(() => {
                loadOrders();
                closeModal();
            }, 1500);
            
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            errorEdit.textContent = error.message;
            errorEdit.style.display = 'block';
        } finally {
            loadingEdit.style.display = 'none';
        }
    }
    
    window.deleteOrder = async function(orderId) {
        if (confirm('Tem certeza que deseja excluir este pedido?')) {
            try {
                loadingOrders.style.display = 'block';
                errorOrders.style.display = 'none';
                
                const response = await fetch(`/api/pedidos/${orderId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao excluir pedido');
                }
                
                loadOrders();
                
            } catch (error) {
                console.error('Erro ao excluir pedido:', error);
                errorOrders.textContent = error.message;
                errorOrders.style.display = 'block';
            } finally {
                loadingOrders.style.display = 'none';
            }
        }
    };
}); 