import sanitize from "sanitize-filename";
import yaml from 'yaml';

import path from 'path';
import fs from 'fs/promises';

export async function readSerializedUnitForSchool<T>(schoolRef : string) : Promise<T> {
    const filename = sanitize(schoolRef + '.yml');

    try {
        return yaml.parse(await fs.readFile(path.join('schools', filename), 'utf8'));
    }
    catch (e)
    {
        console.error(`Exception parsing data for school ${schoolRef}`);
        throw e;
    }
}
