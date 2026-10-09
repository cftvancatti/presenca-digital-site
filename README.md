# Presença Digital

Site estático de apresentação de temas e serviços web, publicado na Netlify.
O site usa HTML, CSS e JavaScript, sem depender do PHP para ser servido.

## Arquivos

- `index.html`: página do site.
- `css/styles.css`: estilos da página.
- `js/script.js`: controles dos vídeos e interações.
- `videos/`: vídeos em MP4 720p, preservando a duração dos arquivos de origem.

## Publicar com Netlify

Instale o [Netlify CLI](https://docs.netlify.com/cli/get-started/) e autentique
sua conta:

```powershell
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

Na primeira publicação, o CLI permite criar um site e associá-lo a este
repositório. Para publicar alterações futuras, use o mesmo comando depois de
atualizar os arquivos.

## Executar localmente

Abra `index.html` no navegador ou inicie um servidor local:

```powershell
php -S 127.0.0.1:8000
```

Depois, acesse <http://127.0.0.1:8000/>.
