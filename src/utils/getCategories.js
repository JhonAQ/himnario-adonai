  const categories = [
    'Adoración y Alabanza',
    'Espíritu Santo',
    'Vida de Cristo',
    'Iglesia y Comunidad',
    'Arrepentimiento y Confesión',
    'Esperanza y Segunda Venida',
    'Bautismo y Santa Cena',
    'Oración y Devoción Personal',
    'Navidad y Pascua',
    'Funerales y Consuelo',
    'Niños y Escuela Dominical',
    'Misión y Evangelismo',
    'Consagración y Servicio',
    'Coros'
  ]

const getCategories = (metadata) => {
  return categories.map((category) => {
    const matchingHymns = metadata.filter((hymn) =>
      hymn.categories.includes(category)
    );

    return {
      title: category,
      cantidad: matchingHymns.length,
      ids: matchingHymns.map(hymn => hymn.id) // Si quieres agregar los IDs
    };
  });
};


export default getCategories
