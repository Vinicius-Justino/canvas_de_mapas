// Gera o grid
function geraTabuleiro() {
    for (let n_linha = 20; n_linha >= 1; n_linha--) {
        // Cria 20 linhas enumeradas de 20 a 1
        let linha = document.createElement("div");

        for (let n_coluna = 1; n_coluna <= 20; n_coluna++) {
            // Cria 20 colunas para cada linha, enumeradas de 1 a 20
            let coluna = document.createElement("button");
            
            // O id da coluna representa a posicao y e x dela no tabuleiro
            coluna.id = `y${n_linha}x${n_coluna}`;
            coluna.name = "vazio-vazio";

            // Quando a coluna e clicada, dispara a funcao de troca de tile
            coluna.addEventListener("click", function() {colocaTile(coluna.id);});

            linha.appendChild(coluna);
        }

        document.querySelector("#tabuleiro").appendChild(linha);
    }
}

// Tile sendo utilizada pelo usuario
let tile_atual = "vazio-vazio";

function modoBorracha() {
    tile_atual = "vazio-vazio";

    document.querySelector("#botao-borracha").style.backgroundColor = "#9999FF";
}

let modo_area = false;
let quadrados = ["", ""];
function modoArea() {
    // Liga e desliga o modo area
    modo_area = !modo_area;
    if (!modo_area) {
        document.querySelector("#botao-area").style.backgroundColor = "";

        return;
    }

    document.querySelector("#botao-area").style.backgroundColor = "#9999FF";

    // Apenas funciona com tiles de chao ou a borracha
    if (!["chao", "vazio"].includes(tile_atual.split("-")[0])) {
        tile_atual = "vazio-vazio";
    }

    // Mostra uma explicacao do modo area
    document.querySelector("#menu").textContent = "";

    let area_explicacao = document.createElement("section");
    area_explicacao.style.width = "80%";

    let titulo = document.createElement("h2");
    titulo.textContent = "Modo Área:";

    let explicacao = document.createElement("p");
    explicacao.textContent = "Selecione uma tile de chão ou a borracha e 2 quadrados para preencher toda a área entre eles.";

    let mostra_tile_atual = document.createElement("p");
    mostra_tile_atual.textContent = `Tile selecionada: ${tile_atual.split("-")[1]}`;

    area_explicacao.appendChild(titulo);
    area_explicacao.appendChild(explicacao);
    area_explicacao.appendChild(document.createElement("br"));
    area_explicacao.appendChild(mostra_tile_atual);
    
    document.querySelector("#menu").appendChild(area_explicacao);
}

// Alterna entre as 3 secoes de tiles do menu
function mostraSecao(secao) {
    // Limpa o menu
    document.querySelector("#menu").textContent = "";

    // Lista por secao quais os itens que devem ser procurados
    let itens = [];
    if (secao == 'paredes') {
        itens = ["barro", "deserto", "ferro", "ferrugem", "masmorra", "tijolo","vidro"];
    } else if (secao =='chao') {
        itens = ["agua", "areia", "ferro1", "ferro2", "grama", "madeira1", "madeira2", "terra", "tijolo1", "tijolo2", "tijolo3"];
    } else if (secao == 'portas') {
        itens = ["ferro1", "ferro2", "grade1", "grade2", "grade3", "grade4", "madeira1", "madeira2", "portal1", "portal2", "portal3", "portal4"];
    } else {
        itens = ["barril", "bau", "cadeira1", "cadeira2", "caixao", "cama", "diamante", "dinheiro", "espinhos1", "espinhos2", "espinhos3", "lapide", "mesa1", "mesa2", "ossos", "placa", "trouxa"];
    }

    for (let opcao of itens) {
        // Cria um botao que comporta-se como um card
        let card = document.createElement("button");
        card.className = "card";

        // Troca a tile atual quando o card for clicado
        card.addEventListener("click", function() {
            tile_atual = secao + '-' + opcao;
            
            // Apaga o botao do modo borracha
            document.querySelector("#botao-borracha").style.backgroundColor = "";

            // Desativa o modo area se a tile nao for um chao
            if (secao != "chao") {
                modo_area = false;

                document.querySelector("#botao-area").style.backgroundColor = "";
            }
        });

        // Imagem do card
        let img_card = document.createElement("img");

        if (secao == "paredes") {
            img_card.src = `images/${secao}/amostras/${opcao}.jpg`;
        } else if (secao == "chao") {
            img_card.src = `images/${secao}/${opcao}.jpg`;
        } else {
            img_card.style.width = "64px";
            img_card.style.height = "64px";

            img_card.src = `images/${secao}/${opcao}.png`;
        }
        

        // Nome do card
        let nome_card = document.createElement("p");
        nome_card.textContent = opcao;

        card.appendChild(img_card);
        card.appendChild(nome_card);

        document.querySelector("#menu").appendChild(card);
    }
}

function colocaTile(posicao) {
    if (modo_area) {
        preencheArea(posicao);

        return;
    }

    tipo_tile = tile_atual.split("-")[0];
    tema_tile = tile_atual.split("-")[1];

    // Nao permite que um objeto seja colocado em uma parede
    if (tipo_tile == "objetos" && document.getElementById(posicao).name.split("-")[0] == "paredes") {
        return;
    }

    // Nomeia o quadrado com a tile que ele vai receber
    document.getElementById(posicao).name = tile_atual;

    // Coloca a tile
    if (tipo_tile == "vazio") {
        document.getElementById(posicao).textContent = "";
        document.getElementById(posicao).style.backgroundImage = "";
    } else if (tipo_tile == "chao") {
        document.getElementById(posicao).style.backgroundImage = `url(./images/${tipo_tile}/${tema_tile}.jpg)`;
    } else if (tipo_tile == "objetos") {
        // Limite de 4 objetos por tile e remove portas para colocar objetos
        if (document.getElementById(posicao).children.length > 0) {
            if (document.getElementById(posicao).children.length > 3) {
                return;
            } else if (document.getElementById(posicao).firstChild.className == "porta") {
                document.getElementById(posicao).textContent = "";
            }
        }

        // Cria uma img para colocar o objeto sobre a tile
        let espaco_img = document.createElement("img");
        espaco_img.src = `images/${tipo_tile}/${tema_tile}.png`;

        document.getElementById(posicao).appendChild(espaco_img);
    } else if (tipo_tile == "portas") {
        document.getElementById(posicao).textContent = "";

        // Cria uma img cara colocar a porta sobre a tile
        let espaco_img = document.createElement("img");
        espaco_img.src = `images/${tipo_tile}/${tema_tile}.png`;
        espaco_img.className = "porta";

        document.getElementById(posicao).appendChild(espaco_img);
    } else {
        document.getElementById(posicao).textContent = "";

        let n_tile = calculaNumeroTileParede(posicao);
        document.getElementById(posicao).style.backgroundImage = `url(./images/${tipo_tile}/${tema_tile}/tile${n_tile}.jpg)`;
    }

    atualizaParedes(posicao);
}

// Preenche toda a area entre 2 quadrados
function preencheArea(posicao) {
    // Precisa de 2 quadrados para funcionar
    quadrados[quadrados.indexOf("")] = posicao;
    if (quadrados.indexOf("") == 1) {
        return;
    }

    // Extrai as coordenadas das 2 posicoes
    let coordenadas_quadrado1 = extraiCoordenadas(quadrados[0]);
    let coordenadas_quadrado2 = extraiCoordenadas(quadrados[1]);

    // Define os vertices da area
    let min_y = Math.min(coordenadas_quadrado1[0], coordenadas_quadrado2[0]);
    let max_y = Math.max(coordenadas_quadrado1[0], coordenadas_quadrado2[0]);

    let min_x = Math.min(coordenadas_quadrado1[1], coordenadas_quadrado2[1]);
    let max_x = Math.max(coordenadas_quadrado1[1], coordenadas_quadrado2[1]);

    // Analisa cada quadrado dentro da area
    for (let y = max_y; y >= min_y; y--) {
        for (let x = min_x; x <= max_x; x++) {
            let analisada_id = `y${y}x${x}`;

            // Apenas apaga/altera a tile se nao for uma parede
            if (document.getElementById(analisada_id).name.split("-")[0] != "paredes") {
                let tema_tile = tile_atual.split("-")[1];

                if (tile_atual == "vazio-vazio") {
                    document.getElementById(analisada_id).textContent = "";
                    document.getElementById(analisada_id).style.backgroundImage = "";
                } else {
                    document.getElementById(analisada_id).style.backgroundImage = `url(./images/chao/${tema_tile}.jpg)`;
                }
            }
        }
    }

    // Limpa o array quadrados
    quadrados = ["", ""];
}

function calculaNumeroTileParede(posicao) {
    // Inicializa o numero da tile
    let numero = 0b00000000;

    // As modificacoes que cada tile ao redor faz no alvo
    let matriz_transformacao = [0b10000000, 0b11100000, 0b00100000, 0b10010100, 0b00000000, 0b00101001, 0b00000100, 0b00000111, 0b00000001];
    let indice = 0;

    // Extrai as coordenadas da tile baseado no id
    let coordenadas = extraiCoordenadas(posicao);

    // Analisa as tiles ao redor do alvo
    for (let i = 1; i >= -1; i--) {
        let analisada_y = coordenadas[0] + i;

        for (let j = -1; j <= 1; j++) {
            let analisada_x = coordenadas[1] + j;
            
            // Verifica se as coordenadas y e x analisadas estao dentro do grid
            if (1 <= analisada_y && analisada_y <= 20 && 1 <= analisada_x && analisada_x <= 20) {
                let analisada_id = `y${analisada_y}x${analisada_x}`;
                // Se a tile analisada nao for uma parede, sombreia o alvo na direcao dela
                if (document.getElementById(analisada_id).name.split("-")[0] != "paredes") {
                    numero = numero | matriz_transformacao[indice];
                }
            }

            indice++;
        }
    }

    // Converte o numero da tile em uma string binaria
    let str_num = "";
    while (numero > 0) {
        str_num = (numero % 2) + str_num;
        numero = (numero - (numero % 2)) / 2;
    }

    return str_num.padStart(8, "0");
}

function atualizaParedes(posicao) {
    // Extrai as coordenadas da tile baseado no id
    let coordenadas = extraiCoordenadas(posicao);

    // Reanalisa as tiles ao redor do alvo
    for (let i = 1; i >= -1; i--) {
        let analisada_y = coordenadas[0] + i;

        for (let j = -1; j <= 1; j++) {
            let analisada_x = coordenadas[1] + j;
            
            // Verifica se as coordenadas y e x analisadas estao dentro do grid
            if (1 <= analisada_y && analisada_y <= 20 && 1 <= analisada_x && analisada_x <= 20) {
                let analisada_id = `y${analisada_y}x${analisada_x}`;
                // Se a tile analisada for uma parede, recalcula o numero da tile
                if (document.getElementById(analisada_id).name.split("-")[0] == "paredes") {
                    let novo_numero = calculaNumeroTileParede(analisada_id);
                    let tema = document.getElementById(analisada_id).name.split("-")[1]

                    document.getElementById(analisada_id).style.backgroundImage = `url(./images/paredes/${tema}/tile${novo_numero}.jpg)`;
                }
            }
        }
    }
}

// Pega o id de uma tile e converte em coordenadas
function extraiCoordenadas(posicao) {
    let coords = ["", ""];
    let passou_x = 0;
    for (let caracter of posicao.substring(1)) {
        if (caracter == "x") {
            passou_x = 1;
        } else {
            coords[passou_x] += caracter;
        }
    }

    return [parseInt(coords[0]), parseInt(coords[1])];
}