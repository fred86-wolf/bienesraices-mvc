(function() {
    const changeStatusButton = document.querySelectorAll('.change-status')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    changeStatusButton.forEach(but => {
        but.addEventListener('click',changeStatusProperties)
    })

    async function changeStatusProperties(e) {

        const {propertyId:id} = e.target.dataset

        try {
            const url = `/properties/${id}`

            const response = await fetch(url,{
                method:'PUT',
                headers:{
                    'CSRF-Token':token
                }
            })

            const {result} = await response.json()
            if (result) {
                if (e.target.classList.contains('bg-yellow-100')) {
                    e.target.classList.add('bg-green-100','text-green-800')
                    e.target.classList.remove('bg-yellow-100','text-yellow-100')
                    e.target.textContent = 'Publicado'
                } else {
                    e.target.classList.remove('bg-green-100','text-green-800')
                    e.target.classList.add('bg-yellow-100','text-yellow-100')
                    e.target.textContent = 'No Publicado'
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
})()