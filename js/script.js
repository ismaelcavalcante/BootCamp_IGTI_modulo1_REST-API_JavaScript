/* 
Estado da aplicação ( state)
 */
let tabUsersResults = null;
let tabStatistics = null;

let users = [];
let usersFilter = [];
let statistics = [];

let countUsers = 0;

let totalMen = 0;
let totalWomen = 0;
let totalSumAge = 0;
let totalAvgAge = 0;

let numberFormat = null;

let userText = null;
let userButton = null;

let filter = null;

window.addEventListener('load', () => {
  tabUsersResults = document.querySelector('#tabUsersResults');
  tabUsersResults.innerHTML = `<h3>Nenhum usuário filtrado</h3>`;

  tabStatistics = document.querySelector('#tabStatistics');
  tabStatistics.innerHTML = `<h3>Nada a ser exibido</h3>`;

  const userText = document.querySelector('#userText');
  userText.focus();

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchUsers();
  render();
});

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  users = json.results.map((user) => {
    const { name, dob, gender, picture } = user;
    return {
      firstName: name.first,
      lastName: name.last,
      age: dob.age,
      gender,
      picture: picture.large,
    };
  });
}

function render() {
  handleUserEvents();
  renderUsersResults();
  renderStaticts();
}

function renderUsersResults() {
  if (filter === null) {
    tabUsersResults.innerHTML = `<h3>Nenhum usuário filtrado</h3>`;
  } else {
    let usersHTML = '<div>';

    usersHTML += `
  <p>último filtro "<b>${filter}</b>"</p>
  <h3>${usersFilter.length} usuário(s) encontrado(s)</h3>
  `;

    usersFilter.forEach((user) => {
      const { picture, firstName, lastName, age } = user;

      const userHTML = `
    <div class='users'>
      <div>
        <img src="${picture}" alt="${firstName}"/>
      </div>

      <div>
        <p>${firstName} ${lastName}, ${age} anos</p>
      </div>
    </div>
    `;

      usersHTML += userHTML;
    });

    usersHTML += '</div>';

    tabUsersResults.innerHTML = usersHTML;
  }
}

function renderStaticts() {
  if (usersFilter.length === 0) {
    tabStatistics.innerHTML = `<h3>Nada a ser exibido</h3>`;
  } else {
    totalMen = usersFilter.filter((user) => user.gender === 'male').length;
    totalWomen = usersFilter.filter((user) => user.gender === 'female').length;
    totalSumAge = usersFilter.reduce((accumulator, current) => {
      return accumulator + current.age;
    }, 0);
    totalAvgAge = totalSumAge / usersFilter.length;

    tabStatistics.innerHTML = `
    <div class='statistics-results'>
      <h3>Estatísticas</h3>
      <p>Sexo masculino: <b>${formatNumber(totalMen)}</b></p>
      <p>Sexo feminino: <b>${formatNumber(totalWomen)}</b></p>
      <p>Soma das idades: <b>${formatNumber(totalSumAge)}</b></p>
      <p>Média das idades: <b>${formatNumber(totalAvgAge)}</b></p>
    </div>
    `;
  }
}

function handleUserEvents(event) {
  userButton = document.querySelector('#userButton');
  userText = document.querySelector('#userText');

  function clearInput() {
    userText.value = '';
    userText.focus();
    userButton.disabled = true;
  }

  userButton.addEventListener('click', () => {
    filterUsers();
    renderUsersResults();
    renderStaticts();
    clearInput();
  });

  userText.addEventListener('keyup', (event) => {
    let hasText = !!userText.value && userText.value.trim() !== '';

    if (!hasText) {
      return;
    }

    userButton.disabled = false;

    if (event.key === 'Enter') {
      filterUsers();
      renderUsersResults();
      renderStaticts();
      clearInput();
    }
  });
}

function filterUsers() {
  const filters = (name) => {
    return users
      .filter(
        (user) =>
          user.firstName.toLowerCase().indexOf(name.toLowerCase()) > -1 ||
          user.lastName.toLowerCase().indexOf(name.toLowerCase()) > -1
      )
      .sort((a, b) => {
        return a.firstName.localeCompare(b.firstName);
      });
  };

  filter = userText.value;

  return (usersFilter = filters(userText.value));
}

function formatNumber(number) {
  return numberFormat.format(number);
}
