document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('itemModal');
    const btn = document.getElementById('addItemBtn');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('itemForm');
    const cardContainer = document.getElementById('cardContainer');
    const imageInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');
    const errorMessage = document.getElementById('errorMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    loadMenuItems();
    
    btn.onclick = function() {
        modal.style.display = 'block';
    }
    
    span.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    imageInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    }
    
    form.onsubmit = async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('nome', document.getElementById('itemName').value);
        formData.append('descricao', document.getElementById('itemDescription').value);
        formData.append('preco', document.getElementById('itemPrice').value);
        formData.append('categoria', document.getElementById('itemCategory').value);
        
        const imageFile = imageInput.files[0];
        if (imageFile) {
            formData.append('imagem', imageFile);
        }
        
        try {
            loadingIndicator.style.display = 'block';
            errorMessage.style.display = 'none';
            
            const response = await fetch('/api/menu', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Erro ao adicionar item');
            }
            
            const result = await response.json();
            
            addCardToContainer(result);
            
            form.reset();
            imagePreview.style.display = 'none';
            modal.style.display = 'none';
            
            loadMenuItems();
            
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }
});

async function loadMenuItems() {
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
            throw new Error('Erro ao carregar itens do menu');
        }
        
        const items = await response.json();
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = ''; 
        
        items.forEach(item => {
            addCardToContainer(item);
        });
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
    }
}

function addCardToContainer(item) {
    const cardContainer = document.getElementById('cardContainer');
    const card = document.createElement('div');
    card.className = 'card';
    
    let imageUrl = '/static/images/default-pizza.jpg';
    if (item.imagem) {
        imageUrl = item.imagem.replace('uploads/', '/uploads/');
    }
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${item.nome}">
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <p><strong>R$ ${parseFloat(item.preco).toFixed(2)}</strong></p>
        <div class="card-actions">
            <button onclick="editItem(${item.id})" class="edit-btn">Editar</button>
            <button onclick="deleteItem(${item.id})" class="delete-btn">Excluir</button>
        </div>
    `;
    
    cardContainer.appendChild(card);
}

async function editItem(id) {
    console.log('Editar item:', id);
}

async function deleteItem(id) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        try {
            const response = await fetch(`/api/menu/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Erro ao excluir item');
            }
            
            loadMenuItems();
        } catch (error) {
            console.error('Erro ao excluir item:', error);
        }
    }
}

const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
let itemToDelete = null;

function openDeleteModal(itemId) {
    itemToDelete = itemId;
    deleteModal.style.display = 'block';
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
    itemToDelete = null;
}

document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const itemId = e.target.closest('.card').dataset.itemId;
        openDeleteModal(itemId);
    });
});

confirmDeleteBtn.addEventListener('click', async () => {
    if (itemToDelete) {
        try {
            const response = await fetch(`/api/menu/${itemToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Remover o card do DOM
                const cardToRemove = document.querySelector(`.card[data-item-id="${itemToDelete}"]`);
                if (cardToRemove) {
                    cardToRemove.remove();
                }
                closeDeleteModal();
            } else {
                console.error('Erro ao excluir item');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
});

cancelDeleteBtn.addEventListener('click', closeDeleteModal);

deleteModal.querySelector('.close').addEventListener('click', closeDeleteModal);

window.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
}); 