export const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября',
    'декабря']

export function clearTime(date) {
    date.setHours(0, 0, 0, 0)
    return date
}

export function formatDate(unixTime) {
    let date = new Date(unixTime * 1000)
    let dd = date.getDate()
    if (dd < 10) dd = '0' + dd

    let mm = date.getMonth() + 1
    if (mm < 10) mm = '0' + mm

    let yy = date.getFullYear()

    let hours = date.getHours()
    if (hours < 10) hours = '0' + hours

    let minutes = date.getMinutes()
    if (minutes < 10) minutes = '0' + minutes

    let seconds = date.getSeconds()
    if (seconds < 10) seconds = '0' + seconds

    return { date: `${dd}-${mm}-${yy}`, time: `${hours} : ${minutes} : ${seconds}` }
}

export function getUnixTime() {
    return Math.floor(Date.now() / 1000)
}