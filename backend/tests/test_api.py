from datetime import date

def dados_tutor(nome="Maria Silva", email="maria@email.com", telefone="11999999999"):
    return {
        "nome": nome,
        "email": email,
        "telefone": telefone,
        "cpf": "123.456.789-09",
        "data_nascimento": "1990-05-20",
        "cep": "01310-100",
        "rua": "Avenida Paulista, 100",
        "bairro": "Bela Vista",
        "cidade": "São Paulo",
        "estado": "SP",
    }


def dados_animal(tutor_id, nome="Rex", especie="Cão", raca="Pastor Alemão"):
    return {
        "nome": nome,
        "especie": especie,
        "raca": raca,
        "data_nascimento": "2021-06-15",
        "sexo": "Macho",
        "castrado": "Não",
        "cor_pelagem": "Dourado, pelo curto",
        "tutor_id": tutor_id,
    }


def test_criar_e_listar_tutor(client):

    response_post = client.post(
        "/tutores/",
        json=dados_tutor()
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
        json=dados_tutor(nome="Carlos Andrade", email="carlos@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal vinculado ao tutor
    response_animal = client.post(
        "/animais/",
        json=dados_animal(tutor_id)
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
        json=dados_tutor(nome="João Pereira", email="joao@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal vinculado ao tutor
    animal_resp = client.post(
        "/animais/",
        json=dados_animal(tutor_id, nome="Mel", especie="Gato", raca="Siamês")
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
        json=dados_tutor(nome="Pedro Santos", email="pedro@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal
    animal_resp = client.post(
        "/animais/",
        json=dados_animal(tutor_id, nome="Bob", raca="Labrador")
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
        json=dados_tutor(nome="Ana Souza", email="ana@email.com", telefone="11988888888")
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
        json=dados_tutor(nome="Pedro Santos", email="pedro@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal
    animal_resp = client.post(
        "/animais/",
        json=dados_animal(tutor_id, nome="Thor", raca="Labrador")
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
        json=dados_tutor(nome="Fernanda Oliveira", email="fernanda@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    # 2. Criar um animal vinculado ao tutor
    animal_resp = client.post(
        "/animais/",
        json=dados_animal(tutor_id, nome="Luna", especie="Gato", raca="Persa")
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
        json=dados_animal(tutor_id=9999, nome="Simba", especie="Gato", raca="Maine Coon")
    )

    # A API deve informar que o tutor não foi encontrado
    assert response.status_code == 404
    assert response.json()["detail"] == "Tutor não encontrado"


def test_criar_tutor_com_email_duplicado(client):

    # 1. Criar o primeiro tutor
    primeiro_tutor = client.post(
        "/tutores/",
        json=dados_tutor(nome="Ana Souza", email="ana@email.com", telefone="11988888888")
    )

    assert primeiro_tutor.status_code == 201

    # 2. Tentar criar outro tutor usando o mesmo e-mail
    segundo_tutor = client.post(
        "/tutores/",
        json=dados_tutor(nome="Maria Oliveira", email="ana@email.com", telefone="11977777777")
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
        json=dados_tutor(nome="Maria Silva", email="maria@email.com", telefone="11999999999")
    )

    assert primeiro_tutor.status_code == 201

    # 2. Criar o segundo tutor
    segundo_tutor = client.post(
        "/tutores/",
        json=dados_tutor(nome="João Silva", email="joao@email.com", telefone="11888888888")
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


def test_criar_e_listar_agendamento(client):

    # 1. Criar um tutor e um animal
    tutor_resp = client.post(
        "/tutores/",
        json=dados_tutor(nome="Marina Costa", email="marina@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    animal_resp = client.post(
        "/animais/",
        json=dados_animal(tutor_id, nome="Bidu", raca="Vira-lata")
    )

    assert animal_resp.status_code == 201

    animal_id = animal_resp.json()["id"]

    # 2. Criar um agendamento
    response = client.post(
        "/agendamentos/",
        json={
            "data": "2026-10-20",
            "horario": "08:00",
            "anotacoes": "Vacinação anual e pesagem.",
            "animal_id": animal_id,
        }
    )

    assert response.status_code == 201

    agendamento_data = response.json()

    assert agendamento_data["data"] == "2026-10-20"
    assert agendamento_data["horario"] == "08:00"
    assert agendamento_data["animal"]["id"] == animal_id
    assert agendamento_data["animal"]["nome"] == "Bidu"

    # 3. Verificar se o agendamento aparece na listagem
    response_get = client.get("/agendamentos/")

    assert response_get.status_code == 200
    assert len(response_get.json()) == 1


def test_criar_agendamento_com_animal_inexistente(client):

    response = client.post(
        "/agendamentos/",
        json={
            "data": "2026-10-20",
            "horario": "08:00",
            "anotacoes": "Consulta de rotina.",
            "animal_id": 9999,
        }
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Animal não encontrado"


def test_criar_e_listar_vacina_e_prontuario(client):

    # 1. Criar um tutor e um animal
    tutor_resp = client.post(
        "/tutores/",
        json=dados_tutor(nome="Beatriz Nunes", email="beatriz@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    animal_resp = client.post(
        "/animais/",
        json=dados_animal(tutor_id, nome="Luna", especie="Gato", raca="Persa")
    )

    assert animal_resp.status_code == 201

    animal_id = animal_resp.json()["id"]

    # 2. Criar uma vacina
    vacina_resp = client.post(
        "/vacinas/",
        json={
            "animal_id": animal_id,
            "nome": "Antirrábica",
            "dose": "Anual",
            "data_aplicacao": "2026-06-03",
            "proxima_dose": "2027-06-03",
            "veterinario": "Dra. Marina Alves",
            "status": "Aplicada",
        }
    )

    assert vacina_resp.status_code == 201
    assert vacina_resp.json()["nome"] == "Antirrábica"

    # 3. Criar um prontuário (data e horário são automáticos)
    prontuario_resp = client.post(
        "/prontuarios/",
        json={
            "animal_id": animal_id,
            "veterinario": "Dr. Felipe Castro",
            "motivo": "Coceira intensa e falhas na pelagem.",
            "anamnese": "Paciente com prurido há 2 semanas.",
            "exame_fisico": "Alopecia focal em região dorsal.",
            "diagnostico": "Dermatite alérgica.",
            "tratamento": "Banho terapêutico semanal e pomada tópica.",
            "observacoes": "Reavaliação do tratamento dermatológico.",
        }
    )

    assert prontuario_resp.status_code == 201
    assert prontuario_resp.json()["data"] == date.today().isoformat()
    assert "horario" in prontuario_resp.json()

    # 4. Listar vacinas e prontuários do animal
    vacinas_get = client.get(f"/vacinas/?animal_id={animal_id}")
    assert vacinas_get.status_code == 200
    assert len(vacinas_get.json()) == 1

    prontuarios_get = client.get(f"/prontuarios/?animal_id={animal_id}")
    assert prontuarios_get.status_code == 200
    assert len(prontuarios_get.json()) == 1
    assert prontuarios_get.json()[0]["motivo"] == (
        "Coceira intensa e falhas na pelagem."
    )
    assert prontuarios_get.json()[0]["diagnostico"] == "Dermatite alérgica."


def test_listar_catalogo_vacinas(client):

    # 1. Listar todo o catálogo
    response = client.get("/catalogo-vacinas/")

    assert response.status_code == 200
    assert len(response.json()) == 10

    # 2. Filtrar por espécie
    response_cao = client.get("/catalogo-vacinas/?especie=Cão")

    assert response_cao.status_code == 200
    assert len(response_cao.json()) == 6
    assert all(item["especie"] == "Cão" for item in response_cao.json())

    response_gato = client.get("/catalogo-vacinas/?especie=Gato")

    assert response_gato.status_code == 200
    assert len(response_gato.json()) == 4
    assert all(item["especie"] == "Gato" for item in response_gato.json())


def test_criar_vacina_vinculada_ao_catalogo(client):

    # 1. Criar um tutor e um animal
    tutor_resp = client.post(
        "/tutores/",
        json=dados_tutor(nome="Larissa Mendes", email="larissa@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    animal_resp = client.post(
        "/animais/",
        json=dados_animal(tutor_id, nome="Thor", raca="Pug")
    )

    assert animal_resp.status_code == 201

    animal_id = animal_resp.json()["id"]

    # 2. Buscar a vacina polivalente do catálogo
    catalogo = client.get("/catalogo-vacinas/?especie=Cão").json()

    v10 = next(
        item for item in catalogo if item["nome"] == "Polivalente V10 (Cão)"
    )

    # 3. Registrar a vacina vinculada ao catálogo
    response = client.post(
        "/vacinas/",
        json={
            "animal_id": animal_id,
            "catalogo_id": v10["id"],
            "nome": v10["nome"],
            "dose": "Anual",
            "data_aplicacao": "2026-05-15",
            "proxima_dose": "2027-05-15",
            "veterinario": "Dra. Marina Alves",
            "status": "Aplicada",
        }
    )

    assert response.status_code == 201
    assert response.json()["catalogo_id"] == v10["id"]
    assert response.json()["nome"] == "Polivalente V10 (Cão)"


def test_criar_vacina_com_catalogo_inexistente(client):

    # 1. Criar um tutor e um animal
    tutor_resp = client.post(
        "/tutores/",
        json=dados_tutor(nome="Rafael Teles", email="rafael@email.com")
    )

    assert tutor_resp.status_code == 201

    tutor_id = tutor_resp.json()["id"]

    animal_resp = client.post(
        "/animais/",
        json=dados_animal(tutor_id, nome="Mel", especie="Gato", raca="Siamês")
    )

    assert animal_resp.status_code == 201

    animal_id = animal_resp.json()["id"]

    # 2. Tentar registrar com catálogo inexistente
    response = client.post(
        "/vacinas/",
        json={
            "animal_id": animal_id,
            "catalogo_id": 9999,
            "nome": "Vacina Teste",
            "dose": "Anual",
            "data_aplicacao": "2026-05-15",
            "veterinario": "Dra. Marina Alves",
            "status": "Aplicada",
        }
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Vacina do catálogo não encontrada"