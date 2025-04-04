document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    const modal = document.getElementById('itemModal');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    const addItemBtn = document.getElementById('addItemBtn');
    const form = document.getElementById('itemForm');
    const editForm = document.getElementById('editForm');
    const cardContainer = document.getElementById('cardContainer');
    const imageInput = document.getElementById('itemImage');
    const editImageInput = document.getElementById('editItemImage');
    const imagePreview = document.getElementById('imagePreview');
    const editImagePreview = document.getElementById('editImagePreview');
    const errorMessage = document.getElementById('errorMessage');
    const editErrorMessage = document.getElementById('editErrorMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');

    console.log('Elements found:', {
        modal: modal !== null,
        editModal: editModal !== null,
        deleteModal: deleteModal !== null,
        addItemBtn: addItemBtn !== null,
        form: form !== null,
        editForm: editForm !== null,
        cardContainer: cardContainer !== null,
        confirmDeleteBtn: confirmDeleteBtn !== null,
        cancelDeleteBtn: cancelDeleteBtn !== null
    });

    loadMenuItems();

    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            console.log('Add button clicked');
            modal.classList.add('active');
            form.reset();
            imagePreview.style.display = 'none';
        });
    }

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            closeAllModals();
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            console.log('Clicked outside modal');
            closeAllModals();
        }
    });

    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            console.log('New image selected');
            handleImagePreview(e, imagePreview);
        });
    }

    if (editImageInput) {
        editImageInput.addEventListener('change', function(e) {
            console.log('Edit image selected');
            handleImagePreview(e, editImagePreview);
        });
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            console.log('Form submitted');
            e.preventDefault();
            await handleFormSubmit(form, 'POST', '/api/menu', null);
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            console.log('Edit form submitted');
            e.preventDefault();
            const itemId = editForm.dataset.itemId;
            await handleFormSubmit(editForm, 'PUT', `/api/menu/${itemId}`, itemId);
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function() {
            console.log('Confirm delete clicked');
            await handleDelete();
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            console.log('Cancel delete clicked');
            closeAllModals();
        });
    }

    function closeAllModals() {
        modal.classList.remove('active');
        editModal.classList.remove('active');
        deleteModal.classList.remove('active');
    }

    function handleImagePreview(e, previewElement) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    }

    async function handleFormSubmit(form, method, url, itemId) {
        console.log('Handling form submit:', { method, url, itemId });
        const formData = new FormData(form);
        
        try {
            loadingIndicator.style.display = 'block';
            const errorElement = form.id === 'itemForm' ? errorMessage : editErrorMessage;
            errorElement.style.display = 'none';
            
            const response = await fetch(url, {
                method: method,
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Erro ao ${method === 'POST' ? 'adicionar' : 'editar'} item`);
            }
            
            const result = await response.json();
            console.log('Form submission successful:', result);
            
            form.reset();
            if (form.id === 'itemForm') {
                imagePreview.style.display = 'none';
                modal.classList.remove('active');
            } else {
                editImagePreview.style.display = 'none';
                editModal.classList.remove('active');
            }
            
            await loadMenuItems();
            
        } catch (error) {
            console.error('Form submission error:', error);
            const errorElement = form.id === 'itemForm' ? errorMessage : editErrorMessage;
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }
});

window.editItem = async function(id) {
    console.log('Edit item clicked:', id);
    try {
        const response = await fetch(`/api/menu/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do item');
        }
        
        const item = await response.json();
        console.log('Item data loaded:', item);
        
        const editForm = document.getElementById('editForm');
        editForm.dataset.itemId = id;
        document.getElementById('editItemName').value = item.nome;
        document.getElementById('editItemDescription').value = item.descricao;
        document.getElementById('editItemPrice').value = item.preco;
        document.getElementById('editItemCategory').value = item.categoria;
        
        const editImagePreview = document.getElementById('editImagePreview');
        if (item.imagem) {
            editImagePreview.src = item.imagem.replace('uploads/', '/uploads/');
            editImagePreview.style.display = 'block';
        } else {
            editImagePreview.style.display = 'none';
        }
        
        document.getElementById('editModal').classList.add('active');
        
    } catch (error) {
        console.error('Error loading item for edit:', error);
        alert('Erro ao carregar item para edição. Por favor, tente novamente.');
    }
}

let itemToDelete = null;

window.openDeleteModal = function(id) {
    console.log('Delete clicked for item:', id);
    itemToDelete = id;
    document.getElementById('deleteModal').classList.add('active');
}

async function handleDelete() {
    console.log('Handling delete for item:', itemToDelete);
    if (itemToDelete) {
        try {
            const response = await fetch(`/api/menu/${itemToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir item');
            }

            document.getElementById('deleteModal').classList.remove('active');
            await loadMenuItems();
            itemToDelete = null;

        } catch (error) {
            console.error('Delete error:', error);
            alert('Erro ao excluir item. Por favor, tente novamente.');
        }
    }
}

async function loadMenuItems() {
    console.log('Loading menu items');
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
            throw new Error('Erro ao carregar itens do menu');
        }
        
        const items = await response.json();
        console.log('Menu items loaded:', items);
        
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = ''; 
        
        items.forEach(item => {
            addCardToContainer(item);
        });
    } catch (error) {
        console.error('Error loading menu items:', error);
        alert('Erro ao carregar itens do menu. Por favor, recarregue a página.');
    }
}

function addCardToContainer(item) {
    const cardContainer = document.getElementById('cardContainer');
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.itemId = item.id;
    
    let imageUrl = '/static/images/default-pizza.jpg';
    if (item.imagem) {
        imageUrl = item.imagem.replace('uploads/', '/uploads/');
    }
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${item.nome}" class="card-image">
        <div class="card-content">
            <h3>${item.nome}</h3>
            <p>${item.descricao}</p>
            <p class="price">R$ ${parseFloat(item.preco).toFixed(2)}</p>
            <div class="actions">
                <button onclick="editItem(${item.id})" class="btn-edit">Editar</button>
                <button onclick="openDeleteModal(${item.id})" class="btn-delete">Excluir</button>
            </div>
        </div>
    `;
    
    cardContainer.appendChild(card);
} 