(function(){
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const map = L.map('map-start').setView([lat, lng ], 16);

    let markers = new L.FeatureGroup().addTo(map)

    let properties = [];

    const filters = {
        category:'',
        price:''
    }

    const categorySelect = document.querySelector('#categories');
    const priceSelect = document.querySelector('#prices');


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    categorySelect.addEventListener('change', e => {
        filters.category = +e.target.value
        searchProperties()
    })

    priceSelect.addEventListener('change', e => {
        filters.price = +e.target.value
        searchProperties()
    })

    const getProperties = async () => {
        try {
            const url = '/api/properties'
            const result = await fetch(url)
            properties = await result.json()
            showProperties(properties)
        } catch (error) {
            console.log(error)
        }
    }

    const showProperties = properties => {

        markers.clearLayers()
        
        properties.forEach(property => {
            const marker = new L.marker([property?.lat,property?.lng],{
                autoPan:true
            })
            .addTo(map)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${property.category.name}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${property?.title}</h1>
                <img src="/uploads/${property?.image}" alt="Imagen de la Propiedad ${property?.title}">
                <p class="text-gray-600 font-bold">${property.price.name}</p>
                <a href="/property/${property.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase text-white">Ver Propiedad</a>
            `)

            markers.addLayer(marker)
        })

    }

    const searchProperties = () => {
        const result = properties.filter( searchCategory ).filter(searchPrice)
        showProperties(result)
    }

    const searchCategory = property => filters.category ? property.idCategory === filters.category : property

    const searchPrice = property => filters.price ? property.idPrice === filters.price : property

    getProperties()
})()