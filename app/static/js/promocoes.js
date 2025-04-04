document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando...');
    
    const newPromotionBtn = document.getElementById('newPromotionBtn');
    const newPromotionModal = document.getElementById('newPromotionModal');
    const editModal = document.getElementById('editModal');
    const closeButtons = document.querySelectorAll('.close');
    const promotionsTableBody = document.getElementById('promotionsTableBody');
    
    if (!newPromotionBtn || !newPromotionModal || !promotionsTableBody) {
        console.error('Elementos necessários não encontrados');
        return;
    }
    
    newPromotionBtn.addEventListener('click', function() {
        console.log('Botão de nova promoção clicado');
        newPromotionModal.style.display = 'block';
        loadProducts();
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Botão de fechar clicado');
            newPromotionModal.style.display = 'none';
            if (editModal) {
                editModal.style.display = 'none';
            }
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === newPromotionModal) {
            newPromotionModal.style.display = 'none';
        }
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
    
    async function loadProducts() {
        try {
            console.log('Carregando produtos...');
            const response = await fetch('/api/menu/');
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar produtos: ${response.status}`);
            }
            
            const products = await response.json();
            console.log('Produtos carregados:', products);
            
            const productSelects = document.querySelectorAll('#produto_id, #editProdutoId');
            productSelects.forEach(select => {
                select.innerHTML = '<option value="">Selecione um produto</option>';
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = product.nome;
                    select.appendChild(option);
                });
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            alert('Erro ao carregar produtos. Por favor, tente novamente.');
        }
    }
    
    const newPromotionForm = document.getElementById('newPromotionForm');
    if (newPromotionForm) {
        newPromotionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Enviando nova promoção...');
            
            const formData = {
                descricao: document.getElementById('descricao').value,
                tipo_desconto: document.getElementById('tipo_desconto').value,
                valor_desconto: parseFloat(document.getElementById('valor_desconto').value),
                produto_id: document.getElementById('produto_id').value || null
            };
            
            try {
                const response = await fetch('/api/promocoes/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || 'Erro ao criar promoção');
                }
                
                const data = await response.json();
                console.log('Promoção criada com sucesso:', data);
                
                newPromotionModal.style.display = 'none';
                newPromotionForm.reset();
                loadPromotions();
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
    
    async function loadPromotions() {
        try {
            console.log('Carregando promoções...');
            const response = await fetch('/api/promocoes/');
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar promoções: ${response.status}`);
            }
            
            const promotions = await response.json();
            console.log('Promoções carregadas:', promotions);
            
            promotionsTableBody.innerHTML = '';
            
            if (!promotions || promotions.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="5" style="text-align: center;">Nenhuma promoção encontrada</td>';
                promotionsTableBody.appendChild(row);
                return;
            }
            
            promotions.forEach(promotion => {
                const row = document.createElement('tr');
                row.dataset.promotionId = promotion.id;
                
                row.innerHTML = `
                    <td>${promotion.descricao}</td>
                    <td>${promotion.tipo_desconto === 'percentual' ? 'Percentual' : 'Fixo'}</td>
                    <td>${promotion.tipo_desconto === 'percentual' ? promotion.valor_desconto + '%' : 'R$ ' + promotion.valor_desconto.toFixed(2)}</td>
                    <td>${promotion.produto_id || 'Todos os produtos'}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editPromotion(${promotion.id})">Editar</button>
                        <button class="action-btn delete-btn" onclick="deletePromotion(${promotion.id})">Excluir</button>
                    </td>
                `;
                
                promotionsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro ao carregar promoções:', error);
            promotionsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: red;">
                        Erro ao carregar promoções: ${error.message}
                    </td>
                </tr>
            `;
        }
    }
    
    window.editPromotion = async function(promotionId) {
        try {
            console.log('Editando promoção:', promotionId);
            const response = await fetch(`/api/promocoes/${promotionId}`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar promoção');
            }
            
            const promotion = await response.json();
            console.log('Promoção carregada:', promotion);
            
            document.getElementById('editPromotionId').value = promotion.id;
            document.getElementById('editDescricao').value = promotion.descricao;
            document.getElementById('editTipoDesconto').value = promotion.tipo_desconto;
            document.getElementById('editValorDesconto').value = promotion.valor_desconto;
            document.getElementById('editProdutoId').value = promotion.produto_id || '';
            
            editModal.style.display = 'block';
        } catch (error) {
            console.error('Erro ao carregar promoção:', error);
            alert('Erro ao carregar promoção. Por favor, tente novamente.');
        }
    };
    
    window.deletePromotion = async function(promotionId) {
        if (confirm('Tem certeza que deseja excluir esta promoção?')) {
            try {
                const response = await fetch(`/api/promocoes/${promotionId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao excluir promoção');
                }
                
                console.log('Promoção excluída com sucesso');
                loadPromotions();
            } catch (error) {
                console.error('Erro ao excluir promoção:', error);
                alert('Erro ao excluir promoção. Por favor, tente novamente.');
            }
        }
    };
    
    const editPromotionForm = document.getElementById('editPromotionForm');
    if (editPromotionForm) {
        editPromotionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Enviando atualização de promoção...');
            
            const promotionId = document.getElementById('editPromotionId').value;
            const formData = {
                descricao: document.getElementById('editDescricao').value,
                tipo_desconto: document.getElementById('editTipoDesconto').value,
                valor_desconto: parseFloat(document.getElementById('editValorDesconto').value),
                produto_id: document.getElementById('editProdutoId').value || null
            };
            
            try {
                const response = await fetch(`/api/promocoes/${promotionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || 'Erro ao atualizar promoção');
                }
                
                const data = await response.json();
                console.log('Promoção atualizada com sucesso:', data);
                
                editModal.style.display = 'none';
                loadPromotions();
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
    
    loadPromotions();
}); 