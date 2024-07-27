    document.addEventListener('DOMContentLoaded', () => {
        
        loadDatabase(); 

        
        document.getElementById('redirecionar-para-inicio')?.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });

        document.querySelector('.fazer-login-botao')?.addEventListener('click', (e) => {
            e.preventDefault();
            login();
        });

        document.querySelector('.registrar-botao')?.addEventListener('click', (e) => {
            e.preventDefault();
            register();
        });

        
        document.querySelector('.registrar-cliente-botao')?.addEventListener('click', (e) => {
            e.preventDefault();
            registerClient();
        });

        document.querySelector('.registrar-endereco-botao')?.addEventListener('click', (e) => {
           e.preventDefault();
           registerAddress();
        });

        document.querySelector('.exportar-banco-de-dados-botao')?.addEventListener('click', (e) => {
            e.preventDefault();
            exportDatabase();
        });

        document.querySelector('.upload-banco-de-dados-botao')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('file-upload').click();
        });

        


    });

    document.getElementById('redirecionar-para-login')?.addEventListener('click', () => {
        window.location.href = 'login.html'; 
    });

    document.getElementById('redirecionar-para-registrar')?.addEventListener('click', () => {
        window.location.href = 'registrar.html'; 
    });

    document.getElementById('enderecoPrincipalBotao')?.addEventListener('click', function() {
        this.classList.toggle('ativo');
    });


    
    function saveDatabase() {
        const clients = alasql('SELECT * FROM clients');
        const addresses = alasql('SELECT * FROM addresses');
        const users = alasql('SELECT * FROM users');
        localStorage.setItem('clients', JSON.stringify(clients));
        localStorage.setItem('addresses', JSON.stringify(addresses));
        localStorage.setItem('users', JSON.stringify(users));
    }

    
    function loadDatabase() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
    
        alasql('CREATE TABLE IF NOT EXISTS users (username STRING, password STRING)');
        alasql('CREATE TABLE IF NOT EXISTS clients (cpf STRING, name STRING, birthdate DATE, phone STRING, mobile STRING)');
        alasql('CREATE TABLE IF NOT EXISTS addresses (cep STRING, street STRING, neighborhood STRING, city STRING, state STRING, country STRING, clientId NUMBER, isPrimary BOOLEAN)');
    
        users.forEach(user => {
            alasql('INSERT INTO users VALUES (?, ?)', [user.username, user.password]);
        });
    
        clients.forEach(client => {
            alasql('INSERT INTO clients VALUES (?, ?, ?, ?, ?)', [client.cpf, client.name, client.birthdate, client.phone, client.mobile]);
        });
    
        addresses.forEach(address => {
            alasql('INSERT INTO addresses VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [address.cep, address.street, address.neighborhood, address.city, address.state, address.country, address.clientId, address.isPrimary]);
        });
    }


    
    function login() {
        const username = document.getElementById('usuario').value.trim();
        const password = document.getElementById('senha').value.trim();

        const user = alasql('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        console.log('Tentativa de login:', username, password);
        console.log('Usuário encontrado:', user);

        if (user.length > 0) {
            alert('Login bem-sucedido!');
            window.location.href = 'cadastro.html';  
        } else {
            alert('Usuário ou senha incorretos!');
        }
    }

   
    function register() {
        const newUsername = document.getElementById('usuario-registrar').value.trim();
        const newPassword = document.getElementById('senha-registrar').value.trim();

        const existingUser = alasql('SELECT * FROM users WHERE username = ?', [newUsername]);

        console.log('Tentativa de registro:', newUsername, newPassword);
        console.log('Usuário existente:', existingUser);

        if (existingUser.length > 0) {
            alert('Usuário já existe!');
        } else {
            alasql('INSERT INTO users (username, password) VALUES (?, ?)', [newUsername, newPassword]);
            saveDatabase(); 
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'login.html';  
        }
    }



function registerClient() {
    const cpf = document.getElementById('cpf').value.trim();
    const name = document.getElementById('nome-completo').value.trim();
    const birthdate = document.getElementById('data-de-nascimento').value.trim();
    const phone = document.getElementById('telefone').value.trim();
    const mobile = document.getElementById('celular').value.trim();

    const existingClient = alasql('SELECT * FROM clients WHERE cpf = ?', [cpf]);

    if (existingClient.length > 0) {
        alert('Cliente com esse CPF já cadastrado!');
    } else {
        alasql('INSERT INTO clients (cpf, name, birthdate, phone, mobile) VALUES (?, ?, ?, ?, ?)', [cpf, name, birthdate, phone, mobile]);
        saveDatabase();
        alert('Cliente cadastrado com sucesso!');
    }
}


function registerAddress() {
    const cep = document.getElementById('cep').value.trim();
    const street = document.getElementById('rua').value.trim();
    const neighborhood = document.getElementById('bairro').value.trim();
    const city = document.getElementById('cidade').value.trim();
    const state = document.getElementById('estado').value.trim();
    const country = document.getElementById('pais').value.trim();
    const clientId = parseInt(document.getElementById('id-do-cliente').value.trim());
    const isPrimary = document.getElementById('enderecoPrincipalBotao').classList.contains('ativo');
    
    if (isNaN(clientId)) {
        alert('ID do cliente inválido!');
        return;
    }

    const existingAddress = alasql('SELECT * FROM addresses WHERE clientId = ? AND isPrimary = TRUE', [clientId]);

    if (isPrimary && existingAddress.length > 0) {
        alert('Já existe um endereço principal para este cliente!');
    } else {
        alasql('INSERT INTO addresses (cep, street, neighborhood, city, state, country, clientId, isPrimary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [cep, street, neighborhood, city, state, country, clientId, isPrimary]);
        saveDatabase();
        alert('Endereço registrado com sucesso!');
    }
}


function exportDatabase() {
    const clients = alasql('SELECT * FROM clients');
    const addresses = alasql('SELECT * FROM addresses');
    const data = {
        clients: clients,
        addresses: addresses
    };
    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database.json';
    a.click();
    URL.revokeObjectURL(url);
}


document.getElementById('file-upload')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                if (data.clients) {
                    alasql('DELETE FROM clients');
                    data.clients.forEach(client => {
                        alasql('INSERT INTO clients VALUES (?, ?, ?, ?, ?)', [client.cpf, client.name, client.birthdate, client.phone, client.mobile]);
                    });
                }
                if (data.addresses) {
                    alasql('DELETE FROM addresses');
                    data.addresses.forEach(address => {
                        alasql('INSERT INTO addresses VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [address.cep, address.street, address.neighborhood, address.city, address.state, address.country, address.clientId, address.isPrimary]);
                    });
                }
                saveDatabase();
                alert('Banco de dados atualizado com sucesso!');
            } catch (e) {
                alert('Erro ao processar o arquivo JSON.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Por favor, selecione um arquivo JSON.');
    }
});