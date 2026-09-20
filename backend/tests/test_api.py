def test_criar_e_listar_tutor(client):

    payload_tutor = {
        "nome": "Maria Silva",
        "email": "maria@email.com",
        "telefone": "11999999999"
    }

    response_post = client.post(
        "/tutores/",
        json=payload_tutor
    )

    assert response_post.status_code == 201

    tutor_data = response_post.json()

    assert tutor_data["nome"] == "Maria Silva"
    assert "id" in tutor_data

    response_get = client.get("/tutores/")

    assert response_get.status_code == 200
    assert len(response_get.json()) == 1


def test_criar_animal_vinculado_a_tutor(client):

    # 1. Criar um tutor primeiro
    tutor_resp = client.post(
        "/tutores/",
        json={
            "nome": "Carlos Andrade",
            "email": "carlos@email.com"
        }
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal vinculado ao tutor
    payload_animal = {
        "nome": "Rex",
        "especie": "Cão",
        "raca": "Pastor Alemão",
        "tutor_id": tutor_id
    }

    response_animal = client.post(
        "/animais/",
        json=payload_animal
    )

    assert response_animal.status_code == 201

    animal_data = response_animal.json()

    assert animal_data["nome"] == "Rex"
    assert animal_data["tutor_id"] == tutor_id

    # 3. Verificar se o animal aparece no tutor
    tutor_get = client.get(
        f"/tutores/{tutor_id}"
    )

    assert tutor_get.status_code == 200

    tutor_data = tutor_get.json()

    assert len(tutor_data["animais"]) == 1
    assert tutor_data["animais"][0]["nome"] == "Rex"


def test_obter_animal_por_id(client):

    # 1. Criar um tutor
    tutor_resp = client.post(
        "/tutores/",
        json={
            "nome": "João Pereira",
            "email": "joao@email.com"
        }
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal vinculado ao tutor
    animal_resp = client.post(
        "/animais/",
        json={
            "nome": "Mel",
            "especie": "Gato",
            "raca": "Siamês",
            "tutor_id": tutor_id
        }
    )

    assert animal_resp.status_code == 201

    animal_id = animal_resp.json()["id"]

    # 3. Buscar o animal pelo ID
    response = client.get(
        f"/animais/{animal_id}"
    )

    assert response.status_code == 200

    animal_data = response.json()

    assert animal_data["id"] == animal_id
    assert animal_data["nome"] == "Mel"
    assert animal_data["especie"] == "Gato"
    assert animal_data["tutor_id"] == tutor_id


def test_atualizar_animal(client):

    # 1. Criar um tutor
    tutor_resp = client.post(
        "/tutores/",
        json={
            "nome": "Pedro Santos",
            "email": "pedro@email.com"
        }
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal
    animal_resp = client.post(
        "/animais/",
        json={
            "nome": "Bob",
            "especie": "Cão",
            "raca": "Labrador",
            "tutor_id": tutor_id
        }
    )

    assert animal_resp.status_code == 201

    animal_id = animal_resp.json()["id"]

    # 3. Atualizar os dados do animal
    response = client.put(
        f"/animais/{animal_id}",
        json={
            "nome": "Bob Atualizado",
            "raca": "Golden Retriever",
            "especie": "Cão",
            "tutor_id": tutor_id
        }
    )

    assert response.status_code == 200

    # 4. Verificar se os dados foram atualizados
    animal_data = response.json()

    assert animal_data["id"] == animal_id
    assert animal_data["nome"] == "Bob Atualizado"
    assert animal_data["raca"] == "Golden Retriever"
    assert animal_data["especie"] == "Cão"
    assert animal_data["tutor_id"] == tutor_id


def test_atualizar_tutor(client):

    # 1. Criar um tutor
    tutor_resp = client.post(
        "/tutores/",
        json={
            "nome": "Ana Souza",
            "email": "ana@email.com",
            "telefone": "11988888888"
        }
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Atualizar os dados do tutor
    response = client.put(
        f"/tutores/{tutor_id}",
        json={
            "nome": "Ana Souza Atualizada",
            "email": "ana.nova@email.com",
            "telefone": "11977777777"
        }
    )

    assert response.status_code == 200

    # 3. Verificar se os dados foram atualizados
    tutor_data = response.json()

    assert tutor_data["id"] == tutor_id
    assert tutor_data["nome"] == "Ana Souza Atualizada"
    assert tutor_data["email"] == "ana.nova@email.com"
    assert tutor_data["telefone"] == "11977777777"


def test_excluir_animal(client):

    # 1. Criar um tutor
    tutor_resp = client.post(
        "/tutores/",
        json={
            "nome": "Pedro Santos",
            "email": "pedro@email.com"
        }
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal
    animal_resp = client.post(
        "/animais/",
        json={
            "nome": "Thor",
            "especie": "Cão",
            "raca": "Labrador",
            "tutor_id": tutor_id
        }
    )

    assert animal_resp.status_code == 201

    animal_id = animal_resp.json()["id"]

    # 3. Excluir o animal
    response = client.delete(
        f"/animais/{animal_id}"
    )

    assert response.status_code == 204

    # 4. Verificar se o animal realmente foi excluído
    response_get = client.get(
        f"/animais/{animal_id}"
    )

    assert response_get.status_code == 404


def test_excluir_tutor_e_animais_vinculados(client):

    # 1. Criar um tutor
    tutor_resp = client.post(
        "/tutores/",
        json={
            "nome": "Fernanda Oliveira",
            "email": "fernanda@email.com"
        }
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal vinculado ao tutor
    animal_resp = client.post(
        "/animais/",
        json={
            "nome": "Luna",
            "especie": "Gato",
            "raca": "Persa",
            "tutor_id": tutor_id
        }
    )

    assert animal_resp.status_code == 201

    animal_id = animal_resp.json()["id"]

    # 3. Excluir o tutor
    response = client.delete(
        f"/tutores/{tutor_id}"
    )

    assert response.status_code == 204

    # 4. Verificar se o tutor foi excluído
    tutor_get = client.get(
        f"/tutores/{tutor_id}"
    )

    assert tutor_get.status_code == 404

    # 5. Verificar se o animal vinculado também foi excluído
    animal_get = client.get(
        f"/animais/{animal_id}"
    )

    assert animal_get.status_code == 404


def test_criar_animal_com_tutor_inexistente(client):

    # Tentar criar um animal usando um tutor que não existe
    response = client.post(
        "/animais/",
        json={
            "nome": "Simba",
            "especie": "Gato",
            "raca": "Maine Coon",
            "tutor_id": 9999
        }
    )

    # A API deve informar que o tutor não foi encontrado
    assert response.status_code == 404
    assert response.json()["detail"] == "Tutor não encontrado"


def test_criar_tutor_com_email_duplicado(client):

    # 1. Criar o primeiro tutor
    primeiro_tutor = client.post(
        "/tutores/",
        json={
            "nome": "Ana Souza",
            "email": "ana@email.com",
            "telefone": "11988888888"
        }
    )

    assert primeiro_tutor.status_code == 201

    # 2. Tentar criar outro tutor usando o mesmo e-mail
    segundo_tutor = client.post(
        "/tutores/",
        json={
            "nome": "Maria Oliveira",
            "email": "ana@email.com",
            "telefone": "11977777777"
        }
    )

    # A API deve rejeitar o e-mail duplicado
    assert segundo_tutor.status_code == 400
    assert segundo_tutor.json()["detail"] == (
        "Já existe um tutor registado com este e-mail."
    )


def test_obter_animal_inexistente(client):

    response = client.get(
        "/animais/9999"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Animal não encontrado"


def test_atualizar_tutor_com_email_duplicado(client):

    # 1. Criar o primeiro tutor
    primeiro_tutor = client.post(
        "/tutores/",
        json={
            "nome": "Maria Silva",
            "email": "maria@email.com",
            "telefone": "11999999999"
        }
    )

    assert primeiro_tutor.status_code == 201

    # 2. Criar o segundo tutor
    segundo_tutor = client.post(
        "/tutores/",
        json={
            "nome": "João Silva",
            "email": "joao@email.com",
            "telefone": "11888888888"
        }
    )

    assert segundo_tutor.status_code == 201

    segundo_tutor_id = segundo_tutor.json()["id"]

    # 3. Tentar alterar o e-mail do segundo tutor
    # para o e-mail que já pertence ao primeiro
    response = client.put(
        f"/tutores/{segundo_tutor_id}",
        json={
            "email": "maria@email.com"
        }
    )

    # A API deve rejeitar o e-mail duplicado
    assert response.status_code == 400
    assert response.json()["detail"] == (
        "Já existe um tutor registado com este e-mail."
    )