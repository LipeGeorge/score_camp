from app.utils.colunas import colunas

def salvarDados(dados) -> bool:
    
    with open('app/utils/inscritos.txt', 'w') as f:
        for inscrito in dados:
            f.write(f'{inscrito[colunas['nome']]}\n')
    
    return True

def buscarDados():
    
    inscritos = ''
    with open('app/utils/inscritos.txt', 'r') as f:
        
        inscritos += f.read()
    
    return inscritos