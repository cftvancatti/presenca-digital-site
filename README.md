# Presença Digital

Site estático de apresentação de temas e serviços web, publicado com GitHub
Pages. O projeto usa HTML, CSS e JavaScript, sem dependência de PHP ou etapa de
compilação.

## Abrir o site

Depois da primeira publicação, acesse:

<https://cftvancatti.github.io/presenca-digital-site/>

## Executar localmente

Abra `index.html` no navegador ou inicie um servidor HTTP na pasta do projeto:

```powershell
php -S 127.0.0.1:8000
```

Depois, acesse <http://127.0.0.1:8000/>.

## Publicar alterações

Envie um `push` para a branch `main`. O workflow em
`.github/workflows/deploy-pages.yml` publica automaticamente o HTML, o CSS, o
JavaScript e os vídeos.

Os oito vídeos foram preparados em 720p para a web e ocupam aproximadamente
59 MB no total. Os arquivos MP4 originais não são necessários para publicar o
site.
