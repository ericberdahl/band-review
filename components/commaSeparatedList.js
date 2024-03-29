import { Children, Fragment } from 'react';

export default function CommaSeparatedList({ children }) {
    children = Children.toArray(children);
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
