## File transfer app

Веб приложение для передачи больших файлов от одного пользователя другому не сохраняя его при этом на сервере.

### Переменные окружения, необходимые для запуска

 - `NODE_PATH = .`
 - `PORT = 5000`
 - `BASE_URI = http://localhost:5000`

Процес передачи файла состоит из нескольких этапов:

1. POST /dropbox

	Пользователь №1 запрашивает ресурс для передачи файла. Сервер создает новий ресурс и возвращает клиенту url созданного ресурса в загловке Location. Дополнительно в теле ответа содержится адрес, на котором клиент №1 может отслеживать появления других клиентов по протоколу Server-Sent-Event.

2. GET /dropbox/:id/es

	Пользователь №1 подписывается на сообщения от сервера.
	После этого шага файл станет доступным для скачивания другими пользователями по ссылке вида:

		http://localhost:5000/dropbox/36726834-e814-4008-8c3b-24f5267208ac

	где

	- http://localhost:5000 - BASE_URI
	- 36726834-e814-4008-8c3b-24f5267208ac - уникальный идентификатор файла на сервере

3. GET /dropbox/:id

	Пользователь №2 запрашивает файл по указанному адресу.
	Сервер сообщает пользователу №1 о том, что пользователь №2 готов к приему файла.

4. POST /dropbox/:id

	Пользователь №1 пересилает файл на указанный адрес.
	На сервере данные передаються от первого пользователя к второму в потоковом режиме (node.js streams), что позволяет не сохранять файл в промежуточном месте.