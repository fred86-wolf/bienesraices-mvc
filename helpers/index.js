const isSeller = (userId, propertyUserId) => {
    return userId === propertyUserId
}

const dateFormate = (date) =>{
    
    const newDate = new Date(date).toISOString().slice(0,10)
    
    console.log('Date',newDate)

    const options = {
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    }


    return new Date(newDate).toLocaleDateString('es-US',options)

}

export {
    isSeller,
    dateFormate
}