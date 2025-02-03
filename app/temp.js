import PocketBase from 'pocketbase';

const pb = new PocketBase('https://dutch.xieservers.com/pb');

const authData = await pb.collection('_superusers').authWithPassword(
    'jxie7488@gmail.com',
    'Kerbal123=',
);

const records = await pb.collection('flavor_combos').getFullList({});

for (var i = 0 ; i < records.length ; i++) {
    var data = records[i];
    data.name = data.name.toLowerCase()
        .replace(/(^|\_)([a-z])/g, (_, space, letter) => 
            (space ? ' ' : '') + letter.toUpperCase()
        );
    await pb.collection('flavor_combos').update(data.id, data);
}