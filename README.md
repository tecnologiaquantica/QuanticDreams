# quanticdreams

Site de divulgação científica sobre computação quântica, em português e inglês.
Estático, sem build e sem dependências externas.

**Repositório:** https://github.com/tecnologiaquantica/QuanticDreams
**Endereço:** https://tecnologiaquantica.github.io/QuanticDreams/ — ative em
Settings → Pages → *Deploy from a branch* (`master`, `/ (root)`).

O nome público do projeto é **quanticdreams**; o repositório no GitHub usa
`QuanticDreams`.

## Estrutura

```
.
├── index.html              # página única, sete seções
├── 404.html                # página de erro
├── assets/
│   ├── css/style.css       # tema escuro, responsivo, print e reduced-motion
│   ├── img/og.png          # imagem 1200×630 para compartilhamento
│   └── js/main.js          # idioma, menu, canvas, revelação por scroll
├── .nojekyll               # desliga o processamento Jekyll no Pages
├── robots.txt              # libera indexação
└── README.md
```

## Idiomas

O site é bilíngue sem framework. Cada texto existe duas vezes no HTML:

```html
<p>
  <span class="lang-pt">Texto em português.</span>
  <span class="lang-en">Text in English.</span>
</p>
```

O CSS mostra apenas o idioma ativo:

```css
html[data-lang="pt"] .lang-en,
html[data-lang="en"] .lang-pt { display: none !important; }
```

O botão no cabeçalho troca `data-lang` e guarda a escolha em `localStorage`
(chave `quanticdreams:lang`). Sem JavaScript, a página abre em português e todo
o conteúdo fica visível: a animação de revelação só é aplicada quando a classe
`js` existe no `<html>`.

Para adicionar conteúdo, escreva os dois blocos e use a mesma classe. Nunca
deixe um idioma sem par: o layout reserva o espaço do texto traduzido.

## Rodar localmente

Qualquer servidor estático serve. Com Python:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

Abrir `index.html` direto pelo sistema de arquivos também funciona, mas o
canvas e o cache podem se comportar de forma diferente.

## Publicar no GitHub Pages

O repositório publica a branch `master`, na raiz, sem ação de build.

1. Settings → Pages → Source: *Deploy from a branch*.
2. Branch: `master`, pasta `/ (root)`.
3. Salvar. O endereço fica `https://<org>.github.io/QuanticDreams/` enquanto o
   repositório mantiver esse nome.

O arquivo `.nojekyll` evita que o Jekyll ignore pastas iniciadas por `_`.

Os caminhos absolutos em `404.html`, `canonical` e `og:image` incluem
`/QuanticDreams/`. Se o repositório for renomeado, atualize esses três pontos
e o link do rodapé.

## Editar

- **Cores e tipografia:** variáveis no topo de `assets/css/style.css`.
- **Seções:** `index.html`, cada uma com `id` usado pela navegação.
- **Navegação:** links do `.site-nav` e do rodapé apontam para esses `id`.
- **Metadados por idioma:** atributos `data-title-pt` e `data-title-en` na tag `<html>`.

## Conteúdo

Textos sobre qubits, superposição, emaranhamento, interferência, decoerência,
correção de erros, algoritmos de Shor e Grover e o estado atual da área.
As afirmações são qualitativas de propósito: não há números de benchmark,
prazos ou previsões de mercado.

## Licença

Conteúdo educacional. Sem afiliação com fabricantes de hardware.
