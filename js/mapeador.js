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

        // Troca a tile atual quando o card e clicado
        card.addEventListener("click", function() {tile_atual = secao + '-' + opcao;});

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

        // Cria uma img cara colocar o objeto sobre a tile
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

function calculaNumeroTileParede(posicao) {
    // Inicializa o numero da tile
    let numero = 0b00000000;

    // As modificacoes que cada tile ao redor faz no alvo
    let matriz_transformacao = [0b10000000, 0b11100000, 0b00100000, 0b10010100, 0b00000000, 0b00101001, 0b00000100, 0b00000111, 0b00000001];
    let indice = 0;

    // Extrai as coordenadas da tile baseado no id
    let coordenadas = ["", ""];
    let passou_x = 0;
    for (let caracter of posicao.substring(1)) {
        if (caracter == "x") {
            passou_x = 1;
        } else {
            coordenadas[passou_x] += caracter;
        }
    }

    let tile_y = parseInt(coordenadas[0]);
    let tile_x = parseInt(coordenadas[1]);

    // Analisa as tiles ao redor do alvo
    for (let i = 1; i >= -1; i--) {
        let analisada_y = tile_y + i;

        for (let j = -1; j <= 1; j++) {
            let analisada_x = tile_x + j;
            
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
    let coordenadas = ["", ""];
    let passou_x = 0;
    for (let caracter of posicao.substring(1)) {
        if (caracter == "x") {
            passou_x = 1;
        } else {
            coordenadas[passou_x] += caracter;
        }
    }

    let tile_y = parseInt(coordenadas[0]);
    let tile_x = parseInt(coordenadas[1]);

    // Reanalisa as tiles ao redor do alvo
    for (let i = 1; i >= -1; i--) {
        let analisada_y = tile_y + i;

        for (let j = -1; j <= 1; j++) {
            let analisada_x = tile_x + j;
            
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