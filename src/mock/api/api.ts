import data from "../data/people.json";

export type pessoa = {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: string;
    city: string;
    state: string;
    postcode: number;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
};

type GetAll = {
  page: number;
  rowsPerPage: number;
  orderBy: string;
  nome: string;
  titulo: string;
  genero: string;
  cidade: string;
  logradouro: string;
  regiao: string;
};

function trimAndLower(filter: string) {
  return filter.trim().toLowerCase();
}

const isAsc = (filter: string): Boolean => filter.includes("asc");

const compare = (a: string, b: string): number => a.localeCompare(b);

const containFilter = (filter: string): Boolean => filter.length > 0;

const order = (field: string, response: pessoa[]): pessoa[] => {
  let result = response;
  if (field.includes("nome")) {
    if (isAsc(field)) {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(a.name.first, b.name.first)
      );
    } else {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(b.name.first, a.name.first)
      );
    }
  }

  if (field.includes("titulo")) {
    if (isAsc(field)) {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(a.name.title, b.name.title)
      );
    } else {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(b.name.title, a.name.title)
      );
    }
  }

  if (field.includes("genero")) {
    if (isAsc(field)) {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(a.gender, b.gender)
      );
    } else {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(b.gender, a.gender)
      );
    }
  }

  if (field.includes("cidade")) {
    if (isAsc(field)) {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(a.location.city, b.location.city)
      );
    } else {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(b.location.city, a.location.city)
      );
    }
  }

  if (field.includes("cidade")) {
    if (isAsc(field)) {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(a.location.street, b.location.street)
      );
    } else {
      result = result.sort((a: pessoa, b: pessoa) =>
        compare(b.location.street, a.location.street)
      );
    }
  }

  return result;
};

const regions = {
  norte: [
    "acre",
    "amazonas",
    "roraima",
    "amapá",
    "pará",
    "rondonia",
    "tocantins",
  ],
  nordeste: [
    "maranhao",
    "piaui",
    "bahia",
    "ceara",
    "rio grande do norte",
    "paraiba",
    "pernambuco",
    "alagoas",
    "sergipe",
  ],
  centroOeste: [
    "mato grosso",
    "goias",
    "mato grosso do sul",
    "distrito federal",
  ],
  sudeste: ["minas gerais", "espirito santo", "sao paulo", "rio de janeiro"],
  sul: ["parana", "santa catarina", "rio grande do sul"],
};

const api = {
  getAll: (options: GetAll): { data: pessoa[]; total: number } => {
    let response = data.results;

    if (containFilter(options.regiao)) {
      const states = regions[options.regiao];

      response = response.filter((p) =>
        states.some((state) => state === p.location.state)
      );
    }

    if (containFilter(options.orderBy)) {
      const { orderBy } = options;
      const fields = orderBy.split(",");

      for (let i in fields) {
        response = order(fields[i], response);
      }
    }

    if (containFilter(options.nome)) {
      let { nome } = options;
      nome = trimAndLower(nome);

      response = response.filter((pessoa) => {
        let { first, last } = pessoa.name;
        first = first.toLowerCase();
        last = last.toLowerCase();

        return first.includes(nome);
      });
    }

    if (containFilter(options.titulo)) {
      let { titulo } = options;
      titulo = trimAndLower(titulo);

      response = response.filter((pessoa) => {
        let { title } = pessoa.name;
        title = title.toLowerCase();
        return title.includes(titulo);
      });
    }

    if (containFilter(options.genero)) {
      let { genero } = options;
      genero = trimAndLower(genero);

      response = response.filter((pessoa) => {
        let { gender } = pessoa;
        gender = gender.toLowerCase();
        return gender === genero;
      });
    }

    if (containFilter(options.cidade)) {
      let { cidade } = options;
      cidade = trimAndLower(cidade);

      response = response.filter((pessoa) => {
        let { city } = pessoa.location;
        city = city.toLowerCase();
        return city.includes(cidade);
      });
    }

    if (containFilter(options.logradouro)) {
      let { logradouro } = options;
      logradouro = trimAndLower(logradouro);

      response = response.filter((pessoa) => {
        let { street } = pessoa.location;
        street = street.toLowerCase();
        return street.includes(logradouro);
      });
    }

    const { page, rowsPerPage } = options;
    const total = response.length;
    response = response.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return { data: response, total };
  },
};

export default api;
