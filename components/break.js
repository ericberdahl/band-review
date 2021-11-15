export default function Break({ eventLabel, unit }) {
    return (
        <div>
            <h2>{eventLabel} - {unit.duration} minute break</h2>
        </div>
    )
}
