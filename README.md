# Presença Digital

Site estático de apresentação de temas e serviços web.

**Publicado em:** <https://cerulean-unicorn-25a43b.netlify.app/>

O site usa HTML, CSS e JavaScript, sem depender do PHP para ser servido.

## Arquivos

- `index.html`: página do site.
- `css/styles.css`: estilos da página.
- `js/script.js`: controles dos vídeos e interações.
- `videos/`: vídeos em MP4 1080p, preservando a duração dos arquivos de origem.

## Publicar com Netlify

Instale o [Netlify CLI](https://docs.netlify.com/cli/get-started/) e autentique
sua conta. Dentro da pasta do repositório, vincule o projeto e publique:

```powershell
npm install -g netlify-cli
netlify login
netlify link --id deb7877e-1f55-4f5b-a088-cabbd34df95c
netlify deploy --prod --dir . --no-build
```

Este site tem um deploy de produção. Para ativar deploys automáticos a cada
`push`, conecte a branch `main` à Netlify pela configuração de **Build & deploy
> Continuous deployment > Repository** do projeto.

## Executar localmente

Abra `index.html` no navegador ou inicie um servidor local:

```powershell
php -S 127.0.0.1:8000
```

Depois, acesse <http://127.0.0.1:8000/>.
