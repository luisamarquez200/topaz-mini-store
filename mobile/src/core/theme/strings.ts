export const STRINGS = Object.freeze({
  nav: {
    productsTitle: 'Productos',
    productsTab: 'Productos',
    favoritesTitle: 'Favoritos',
    favoritesTab: 'Favoritos',
    detailTitle: 'Detalle',
    back: 'Volver',
  },
  products: {
    errorTitle: 'Error de conexión',
    loadError: 'Error al cargar los productos',
    notFound: 'Producto no encontrado',
    emptyList: 'No hay productos disponibles',
    detailLoading: 'Cargando detalles del producto...',
    detailErrorTitle: 'Producto no disponible',
    detailNotFoundMessage:
      'No pudimos encontrar la información de este producto',
    detailLoadError: 'Error al cargar el detalle del producto',
    descriptionHeader: 'Descripción',
    brandPrefix: 'Marca: ',
    starSymbol: '★',
    stockPrefix: 'Stock: ',
    outOfStock: 'Sin stock',
    thumbnailSuffix: ' thumbnail',
    placeholderCatalogSubtitle: 'Productos disponibles en Topaz Store',
  },
  favorites: {
    emptyTitle: 'Aún no tienes favoritos',
    emptySubtitle:
      'Explora el catálogo y guarda los productos que más te gusten.',
    exploreButton: 'Explorar productos',
    saveFavorite: 'Guardar',
    savedFavorite: 'Guardado',
    storageName: 'topaz-favorites-storage',
  },
  filters: {
    searchPlaceholder: 'Buscar productos, marcas...',
    searchA11y: 'Buscar productos',
    clearSearchA11y: 'Limpiar búsqueda',
    allCategories: 'Todos',
    noResultsTitle: 'No se encontraron resultados',
    noResultsSubtitle:
      'Intenta con otros términos o limpia los filtros activos.',
    clearFiltersButton: 'Limpiar filtros',
  },
  sort: {
    a11yLabel: 'Ordenar productos',
    default: 'Destacados',
    priceAsc: 'Menor precio',
    priceDesc: 'Mayor precio',
    ratingDesc: 'Mejor valorados',
  },
  common: {
    retry: 'Reintentar',
    defaultErrorTitle: 'Ha ocurrido un problema',
    unknownError: 'Ha ocurrido un error inesperado',
    networkError:
      'No pudimos conectar con el servidor. Revisa tu conexión a internet.',
    timeoutError:
      'El servidor tardó demasiado en responder. Inténtalo de nuevo.',
    serviceUnavailableError:
      'El catálogo no está disponible en este momento. Inténtalo más tarde.',
    serverError: 'Ocurrió un error en el servidor. Inténtalo más tarde.',
    notFoundError: 'No encontramos lo que buscabas.',
    badRequestError: 'La solicitud no es válida.',
    addFavoriteA11y: 'Agregar a favoritos',
    removeFavoriteA11y: 'Quitar de favoritos',
  },
});
