import { toChildArray, Fragment } from 'preact';

export default function CommaSeparatedList({ children }) {
    children = toChildArray(children);
    const childCount = children.length;

    return (
        <>
            {children.map((child, index) => {
                return (
                    <Fragment key={index}>
                        {0 < index && 2 < childCount && ','}
                        {0 < index && index + 1 == childCount && ' and'}
                        {0 < index && ' '}
                        {child}
                    </Fragment>
                );
            })}
        </>
    );
}
