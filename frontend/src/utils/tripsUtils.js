const getImage = (src) => {
    if(src == undefined) {
        return `/assets/placeholder.webp`
    } else {
        return src
    }
}

const getDate = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : undefined;

    const areEqual = start.getTime() === end?.getTime()
    const startString = start.toLocaleDateString("ro-RO")
    const endString = end && !areEqual ? ` - ${end.toLocaleDateString("ro-RO")}` : ''
    
    return `${startString}${endString}`
}

export { getImage, getDate }