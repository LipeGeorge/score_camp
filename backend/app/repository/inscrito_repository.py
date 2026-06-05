from app.utils.colunas import colunas

def salvarDados(dados) -> bool:
    
    with open('app/utils/inscritos.txt', 'w') as f:
        for inscrito in dados:
            f.write(f'{inscrito[colunas['nome']]}\n')
    
    return True


def buscarDados():
    
    with open('app/utils/inscritos.txt', 'r') as arquivo:
        inscritos = [linha.strip() for linha in arquivo.readlines()]
        
    return inscritos


def buscar_dado_inscrito(nome: str):
    
    with open('app/utils/inscritos.txt', 'r') as arquivo:
        inscritos = [inscrito.strip() for inscrito in arquivo.readlines() if nome in inscrito]
    
    return inscritos