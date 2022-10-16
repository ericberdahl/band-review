import getConfig from 'next/config'
import Link from 'next/link';

const { serverRuntimeConfig } = getConfig()

function internalLink(page) {
    return page;
}

function externalLink(page) {
    var internalPage = internalLink(page);

    if ('/' == internalPage.slice(-1)) {
        internalPage += 'index';
    }

    return internalPage + '.html';
}

export default function PageLink({ page, anchor, children, passHref }) {
    const href = (serverRuntimeConfig.isExport ? externalLink(page) : internalLink(page)) + (anchor && 0 < anchor.length ? '#' + anchor : '');

    return (
        <Link href={href} passHref={passHref}>{children}</Link>
    );
}
