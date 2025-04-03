document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const promotionForm = document.getElementById('promotion-form');
    const promotionsTableBody = document.getElementById('promotions-table-body');
    const loadingPromotions = document.getElementById('loading-promotions');
    const errorPromotions = document.getElementById('error-promotions');
    const errorPromotion = document.getElementById('error-promotion');
    const successPromotion = document.getElementById('success-promotion');
    const loadingPromotion = document.getElementById('loading-promotion');
    
    const editModal = document.getElementById('edit-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const saveEditBtn = document.getElementById('save-edit');
    const editForm = document.getElementById('edit-form');
    const editPromotionIdInput = document.getElementById('edit-promotion-id');
    const editDescricaoInput = document.getElementById('edit-descricao');
    const editTipoDescontoSelect = document.getElementById('edit-tipo_desconto');
    const editValorDescontoInput = document.getElementById('edit-valor_desconto');
    const editProdutoIdSelect = document.getElementById('edit-produto_id');
    const errorEdit = document.getElementById('error-edit');
    const successEdit = document.getElementById('success-edit');
    const loadingEdit = document.getElementById('loading-edit');
    
    let menuItems = [];
    let currentPromotion = null;
    
    loadPromotions();
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
    
    promotionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createPromotion();
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);
    saveEditBtn.addEventListener('click', updatePromotion);

    window.onclick = function(event) {
        if (event.target === editModal) {
            closeModal();
        }
    };
    
    async function loadPromotions() {
        try {
            loadingPromotions.style.display = 'block';
            errorPromotions.style.display = 'none';
            
            const response = await fetch('/api/promocoes');
            if (!response.ok) {
                throw new Error('Erro ao carregar promoções');
            }
            
            const promotions = await response.json();
            displayPromotions(promotions);
        } catch (error) {
            console.error('Erro ao carregar promoções:', error);
            errorPromotions.textContent = error.message;
            errorPromotions.style.display = 'block';
        } finally {
            loadingPromotions.style.display = 'none';
        }
    }
    
    async function loadMenuItems() {
        try {
            const response = await fetch('/api/menu');
            if (!response.ok) {
                throw new Error('Erro ao carregar itens do menu');
            }
            
            menuItems = await response.json();
            populateProductSelects();
        } catch (error) {
            console.error('Erro ao carregar itens do menu:', error);
        }
    }
    
    function populateProductSelects() {
        const productSelects = [
            document.getElementById('produto_id'),
            document.getElementById('edit-produto_id')
        ];
        
        productSelects.forEach(select => {
            select.innerHTML = '<option value="">Selecione um produto</option>';
            
            menuItems.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.nome} - R$ ${parseFloat(item.preco).toFixed(2)}`;
                select.appendChild(option);
            });
        });
    }
    
    function displayPromotions(promotions) {
        promotionsTableBody.innerHTML = '';
        
        if (promotions.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center;">Nenhuma promoção encontrada</td>';
            promotionsTableBody.appendChild(row);
            return;
        }
        
        promotions.forEach(promotion => {
            const row = document.createElement('tr');
            
            const produtoNome = promotion.produto_id 
                ? menuItems.find(item => item.id === promotion.produto_id)?.nome || 'Produto não encontrado'
                : 'Nenhum produto específico';
            
            row.innerHTML = `
                <td>${promotion.id}</td>
                <td>${promotion.descricao}</td>
                <td>${promotion.tipo_desconto}</td>
                <td>${promotion.tipo_desconto === 'percentual' ? `${promotion.valor_desconto}%` : `R$ ${promotion.valor_desconto}`}</td>
                <td>${produtoNome}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editPromotion(${promotion.id})">Editar</button>
                    <button class="action-btn delete-btn" onclick="deletePromotion(${promotion.id})">Excluir</button>
                </td>
            `;
            
            promotionsTableBody.appendChild(row);
        });
    }
    
    async function createPromotion() {
        try {
            loadingPromotion.style.display = 'block';
            errorPromotion.style.display = 'none';
            successPromotion.style.display = 'none';
            
            const promotionData = {
                descricao: document.getElementById('descricao').value,
                tipo_desconto: document.getElementById('tipo_desconto').value,
                valor_desconto: parseFloat(document.getElementById('valor_desconto').value),
                produto_id: document.getElementById('produto_id').value || null
            };
            
            const response = await fetch('/api/promocoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promotionData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao criar promoção');
            }
            
            promotionForm.reset();
            
            successPromotion.textContent = 'Promoção criada com sucesso!';
            successPromotion.style.display = 'block';
            
            loadPromotions();
            
            document.querySelector('[data-tab="list-promotions"]').click();
            
        } catch (error) {
            console.error('Erro ao criar promoção:', error);
            errorPromotion.textContent = error.message;
            errorPromotion.style.display = 'block';
        } finally {
            loadingPromotion.style.display = 'none';
        }
    }
    
    window.editPromotion = async function(promotionId) {
        try {
            loadingEdit.style.display = 'block';
            errorEdit.style.display = 'none';
            successEdit.style.display = 'none';
            
            const response = await fetch(`/api/promocoes/${promotionId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar promoção');
            }
            
            currentPromotion = await response.json();
            
            editPromotionIdInput.value = currentPromotion.id;
            editDescricaoInput.value = currentPromotion.descricao;
            editTipoDescontoSelect.value = currentPromotion.tipo_desconto;
            editValorDescontoInput.value = currentPromotion.valor_desconto;
            editProdutoIdSelect.value = currentPromotion.produto_id || '';
            
            editModal.style.display = 'block';
            
        } catch (error) {
            console.error('Erro ao carregar promoção para edição:', error);
            errorEdit.textContent = error.message;
            errorEdit.style.display = 'block';
        } finally {
            loadingEdit.style.display = 'none';
        }
    };
    
    function closeModal() {
        editModal.style.display = 'none';
        editForm.reset();
        currentPromotion = null;
    }
    
    async function updatePromotion() {
        try {
            loadingEdit.style.display = 'block';
            errorEdit.style.display = 'none';
            successEdit.style.display = 'none';
            
            const promotionId = editPromotionIdInput.value;
            const promotionData = {
                descricao: editDescricaoInput.value,
                tipo_desconto: editTipoDescontoSelect.value,
                valor_desconto: parseFloat(editValorDescontoInput.value),
                produto_id: editProdutoIdSelect.value || null
            };
            
            const response = await fetch(`/api/promocoes/${promotionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(promotionData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao atualizar promoção');
            }
            
            successEdit.textContent = 'Promoção atualizada com sucesso!';
            successEdit.style.display = 'block';
            
            setTimeout(() => {
                loadPromotions();
                closeModal();
            }, 1500);
            
        } catch (error) {
            console.error('Erro ao atualizar promoção:', error);
            errorEdit.textContent = error.message;
            errorEdit.style.display = 'block';
        } finally {
            loadingEdit.style.display = 'none';
        }
    }
    
    window.deletePromotion = async function(promotionId) {
        if (confirm('Tem certeza que deseja excluir esta promoção?')) {
            try {
                loadingPromotions.style.display = 'block';
                errorPromotions.style.display = 'none';
                
                const response = await fetch(`/api/promocoes/${promotionId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao excluir promoção');
                }
                
                loadPromotions();
                
            } catch (error) {
                console.error('Erro ao excluir promoção:', error);
                errorPromotions.textContent = error.message;
                errorPromotions.style.display = 'block';
            } finally {
                loadingPromotions.style.display = 'none';
            }
        }
    };
}); 