# MELAYANE — Pedidos do website

Preparado para activação. O website público ainda não liga ao formulário, pois falta o URL real da implantação.

## Instalação
1. Na conta Google que administrará os pedidos, crie um projecto em https://script.google.com/ chamado **MELAYANE — Pedidos do website**.
2. Copie Code.gs para o ficheiro de código. Crie dois ficheiros HTML chamados **Form** e **Admin**, copiando os correspondentes conteúdos deste directório.
3. No editor seleccione e execute **configurarMelayane_** e autorize. Esta função cria a planilha privada e regista o email da conta executora como administrador. Não partilhe a planilha publicamente. O URL aparece no registo de execução.
4. Crie uma implantação de aplicação Web **Pública — formulário**: executar como **Eu**, acesso **Qualquer pessoa**. Copie o URL /exec e forneça-o para ligar o formulário ao website.
5. Crie uma segunda implantação **Privada — administração**: executar como **Utilizador que acede**, acesso **Apenas eu** (ou opção equivalente que restrinja ao proprietário). Abra o URL desta implantação acrescentando **?admin=1**, com a conta usada na configuração.
6. Se as opções da sua conta diferirem, pare antes de tornar a administração pública. A identidade é validada no servidor em todas as leituras e alterações; identidade vazia é recusada. Nunca substituir por getEffectiveUser, que na implantação pública representa o proprietário.
7. Novas versões exigem actualizar ambas as implantações.

## Verificação antes de activar
- Enviar pedido fictício: deve criar uma linha com estado Novo e devolver referência só depois de gravar.
- Abrir painel privado e confirmar contagem, filtro e alteração persistente de estado.
- Tentar ?admin=1 no endereço público em janela anónima: deve recusar acesso; listarPedidos e actualizarEstado também devem recusar.
- Mensagem com HTML deve aparecer como texto no painel. Valores que começam por caracteres de fórmula são guardados como texto.
- Repetir pedido idêntico em 10 minutos: deve devolver a mesma referência.
- Campos vazios, serviço inventado, mensagem demasiado longa e ausência de consentimento devem ser recusados no servidor.
- A conta administradora tem de coincidir com a usada ao executar a configuração.

## Âmbito
O painel acompanha apenas pedidos feitos pelo formulário. Não lê Gmail nem WhatsApp. Os alertas são contagens no painel ao carregar ou actualizar; não são notificações push nem alertas de mensagens externas.
O formulário abre como página própria Google Apps Script; não depende de CORS nem anuncia sucesso antes de confirmar a gravação.
Há campo anti-robô, deduplicação, limite global de 100 pedidos/hora e bloqueio de escrita concorrente. Não substituem protecção anti-abuso avançada.
As permissões e limites diários do Google aplicam-se. Não existem envios automáticos de email.
