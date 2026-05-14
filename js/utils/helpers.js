export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export function formatTimeAMPM(time24) {
    const [hours24, minutes] = time24.split(':');
    let hours = parseInt(hours24, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}
