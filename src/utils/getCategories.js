const categories = [
  // 'Adoración y Alabanza',
  'Espíritu Santo',
  // 'Vida de Cristo',
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
];

export const getCategories = (metadata) => {
  if (!metadata) return [];

  return categories.map((category) => {
    const hymns = metadata.filter(h => h.categories.includes(category));
    return {
      title: category,
      cantidad: hymns.length,
      ids: hymns.map(h => h.id)
    };
  });
};
