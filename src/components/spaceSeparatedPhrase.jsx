import { toChildArray, Fragment } from 'preact';

export default function SpaceSeparatedPhrase({ children, separator }) {
    separator = separator || ' '
    children = toChildArray(children);

    return (
        <>
            {children.map((child, index) => {
                return (
                    <Fragment key={index}>
                        {0 < index && separator}
                        {child}
                    </Fragment>
                );
            })}
        </>
    );
}
