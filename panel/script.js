const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = table.querySelector('tbody');
const trAll = document.getElementsByTagName('tr');
const baseAPIUrl = 'https://jsonplaceholder.typicode.com/';
const commentsEndpoint = `${baseAPIUrl}/comments`;
const postsEndpoint = `${baseAPIUrl}/posts`;

const checkShowForbidden = document.querySelector('.showForbidden');
const input = document.querySelector('.searchInput');
let startIndex = 0;

const COMMENTS_PER_PAGE = 20;
const arrowLeft = document.querySelector('.fa-arrow-left');
const arrowRight = document.querySelector('.fa-arrow-right');
const select = document.getElementById('select');

const WRONG_WORD = 'quam';

function removeRow() {
	const checkboxes = document.querySelectorAll(
		'input[type="checkbox"]:checked'
	);
	checkboxes.forEach((checkbox) => {
		const row = checkbox.parentNode.parentNode;
		const indexOfCommentBody = 3;
		const children = row.children[indexOfCommentBody];
		console.log(children.textContent);
		row.remove();
	});
}

function generateRows(data) {
	for (let i = startIndex; i < startIndex + COMMENTS_PER_PAGE; i++) {
		const tr = document.createElement('tr');
		tr.setAttribute('id', data[i]['id']);
		tr.innerHTML = `<td class="firstTd">${data[i]['id']}</td>
    <td class="name">${data[i]['name']}</td>
    <td class="email">${data[i]['email']}</td>
    <td class="body">${data[i]['body']}</td>
    <td class="action"><button class="btns">Usuń</button>
    <label for="checkShowForbidden">Zaznacz komentarz, by usunąć</label>
    <input type="checkbox" class="deleteCheck" name="checkShowForbidden"/> 
    </td>`;
		tbody.appendChild(tr);
	}
}

// pure functions

// nie mają zależności zewnętrznych

//pure function
// const test=(a,b)=>a+b;

// a to nie pure
// const test2=new Date()

// const test4=(a)=>a*test2.getMilliseconds()

function searchPhrase(tdName, tdEmail, tdBody) {
			input.addEventListener('input', () => {
				if (
					(tdName.textContent
						.toLowerCase()
						.includes(input.value.toLowerCase()) ||
						tdEmail.textContent
							.toLowerCase()
							.includes(input.value.toLowerCase()) ||
						tdBody.textContent.toLowerCase().includes(input.value)) &&
					input.value != ''
				) {
					tr.style.background = 'rgb(105, 29, 252)';
				} else if (input.value == '') {
					tr.style.background = 'rgba(0, 0, 0, 0.2)';
				} else {
					tr.style.background = 'rgba(0, 0, 0, 0.2)';
				}
			});
		}

function displayTable(data) {
	generateRows(data);
	//TODO: do osbnej funkcji :done

	function generateRowDeleteButtons() {
		const buttons = document.querySelectorAll('.btns');
		buttons.forEach((button) => {
			button.addEventListener('click', removeRow);
		});
	}
	generateRowDeleteButtons();

	Array.from(trAll).forEach((tr) => {
		//TODO: magic numbe

		//TODO: nazewnictwo done
		const tdName = tr.children[1];
		const tdEmail = tr.children[2];
		const tdBody = tr.children[3];

		//TODO: nazewnictwo: done
		checkShowForbidden.addEventListener('click', () =>
			colorRow(tdName, tdBody, tr)
		);
		//TODO: przerobić tak żeby fun2 było pure  done: (fun2 przerobiłem na searchPhrase)
		function colorRow(tdName, tdBody, tr) {
			if (
				(tdName.textContent.includes(WRONG_WORD) ||
					tdBody.textContent.includes(WRONG_WORD)) &&
				tr.style.background != 'goldenrod'
			) {
				tr.style.background = 'goldenrod';
			} else {
				tr.style.background = 'rgba(0, 0, 0, 0.2)';
			}
		}

		
		searchPhrase(tdName, tdEmail, tdBody);
	});

	function showNextComments() {
		if (startIndex > 0) {
			tbody.innerHTML = ``;
			startIndex -= COMMENTS_PER_PAGE;
			displayTable(data);
		}
	}
	function showPreviousComments() {
		if (startIndex < data.length - COMMENTS_PER_PAGE) {
			tbody.innerHTML = ``;
			startIndex += COMMENTS_PER_PAGE;
			displayTable(data);
		}
	}
	arrowLeft.addEventListener('click', showNextComments);
	arrowRight.addEventListener('click', showPreviousComments);
}

//start
let commentsEndpointData;
fetch(commentsEndpoint)
	.then((res) => res.json())
	.then((data) => {
		commentsEndpointData = data;
		//TODO: data do globalnej zmiennej: done

		displayTable(commentsEndpointData);
	});


let postsEndpointData;
fetch(postsEndpoint)
	.then((res) => res.json())
	.then((data) => {
		//TODO: nazewnictwo: done
		postsEndpointData = data;
		function loadOptions() {
			for (i = 0; i < postsEndpointData.length; i++) {
				const option = document.createElement('option');
				option.setAttribute('value', postsEndpointData[i]['id']);
				option.textContent = postsEndpointData[i]['title'];
				select.appendChild(option);
			}
		}

		function showPosts() {
			const selectedOption = select.value;
			thead.innerHTML = '';
			tbody.innerHTML = '';
			const tr = document.createElement('tr');
			tr.innerHTML = `<td class="body">${
				postsEndpointData[selectedOption - 1]['body']
			}</td>`;
			tbody.appendChild(tr);
		}
		
		loadOptions(postsEndpointData);
		select.addEventListener('change', showPosts);
	});
