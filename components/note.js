export default function Note({ children, label }) {
    label = label || 'NOTE';

    return (
        <div>
            <>{label.toUpperCase()}: </>
            {children}
        </div>
    );
}
