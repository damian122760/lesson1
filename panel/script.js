const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = table.querySelector('tbody');
const trAll = document.getElementsByTagName('tr');
const URL = 'https://jsonplaceholder.typicode.com/comments';
const URL2 = 'https://jsonplaceholder.typicode.com/posts';
const check = document.querySelector('.showForbidden');
const input = document.querySelector('.searchInput');
let startIndex = 0;
const arrowLeft = document.querySelector('.fa-arrow-left');
const arrowRight = document.querySelector('.fa-arrow-right');
const select = document.getElementById('select');

function removeRow() {
	const checkboxes = document.querySelectorAll(
		'input[type="checkbox"]:checked'
	);
	checkboxes.forEach((checkbox) => {
		const row = checkbox.parentNode.parentNode;
		const children = row.children[3];
		console.log(children.textContent);
		row.remove();
	});
}
function displayTable(data) {
	for (let i = startIndex; i < startIndex + 20; i++) {
		const tr = document.createElement('tr');
		tr.setAttribute('id', data[i]['id']);
		tr.innerHTML = `<td class="firstTd">${data[i]['id']}</td>
    <td class="name">${data[i]['name']}</td>
    <td class="email">${data[i]['email']}</td>
    <td class="body">${data[i]['body']}</td>
    <td class="action"><button class="btns">Usuń</button>
    <label for="check">Zaznacz komentarz, by usunąć</label>
    <input type="checkbox" class="deleteCheck" name="check"/> 
    </td>`;
		tbody.appendChild(tr);
	}
	const buttons = document.querySelectorAll('.btns');
	buttons.forEach((button) => {
		button.addEventListener('click', removeRow);
	});
	Array.from(trAll).forEach((tr) => {
		const children1 = tr.children[1];
		const children2 = tr.children[2];
		const children3 = tr.children[3];
		check.addEventListener('click', fun1);
		input.addEventListener('input', fun2);
		function fun1() {
			if (
				(children1.textContent.includes('quam') ||
					children3.textContent.includes('quam')) &&
				tr.style.background != 'goldenrod'
			) {
				tr.style.background = 'goldenrod';
			} else {
				tr.style.background = 'rgba(0, 0, 0, 0.2)';
			}
		}
		function fun2() {
			if (
				(children1.textContent
					.toLowerCase()
					.includes(input.value.toLowerCase()) ||
					children2.textContent
						.toLowerCase()
						.includes(input.value.toLowerCase()) ||
					children3.textContent.toLowerCase().includes(input.value)) &&
				input.value != ''
			) {
				tr.style.background = 'rgb(105, 29, 252)';
			} else if (input.value == '') {
				tr.style.background = 'rgba(0, 0, 0, 0.2)';
			} else {
				tr.style.background = 'rgba(0, 0, 0, 0.2)';
			}
		}
	});
}

fetch(URL)
	.then((res) => res.json())
	.then((data) => {
		displayTable(data);
		function showNextComments() {
			if (startIndex > 0) {
				tbody.innerHTML = ``;
				startIndex -= 20;
				displayTable(data);
			}
		}
		function showPreviousComments() {
			if (startIndex < data.length - 20) {
				tbody.innerHTML = ``;
				startIndex += 20;
				displayTable(data);
			}
		}
		arrowLeft.addEventListener('click', showNextComments);
		arrowRight.addEventListener('click', showPreviousComments);
	});

fetch(URL2)
	.then((res) => res.json())
	.then((data) => {
		function fun1(data) {
			for (i = 0; i < data.length; i++) {
				const option = document.createElement('option');
				option.setAttribute('value', data[i]['id']);
				option.textContent = data[i]['title'];
				select.appendChild(option);
			}
		}
		fun1(data);
		select.addEventListener('change', fun2);
		function fun2() {
			const selectedOption = select.value;
			fetch(URL2)
				.then((res) => res.json())
				.then((data) => {
					thead.innerHTML = '';
					tbody.innerHTML = '';
					const tr = document.createElement('tr');
					tr.innerHTML = `<td class="body">${
						data[selectedOption - 1]['body']
					}</td>`;
					tbody.appendChild(tr);
				});
		}
	});
