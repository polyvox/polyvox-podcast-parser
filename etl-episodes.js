'use strict';

var fs = require('fs');

var src = fs.readFileSync('./channel.json'),
    feed = JSON.parse(src),
    episodes = feed.items,
    result = {episodes: []};

for (var i = 0; i < episodes.length; i += 1) {
  let episode = episodes[i];

  let date = new Date(episode.date);
  let published_at = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  let artworkHref = episode.custom_elements[2]['itunes:image']._attr.href;
  let artwork = decodeURI(artworkHref.substring(artworkHref.lastIndexOf('/') + 1));

  let audioHref = episode.enclosure.url;
  let audio = decodeURI(audioHref.substring(audioHref.lastIndexOf('/') + 1));

  let description = episode.custom_elements[1]['itunes:summary']._cdata
    .replace(/<h3>/g, '### ')
    .replace(/<\/h3>/g, '\n\n')
    .replace(/\\"/g, '""')
    .replace(/<\/?ul>/g, '\n')
    .replace(/<li>/g, '* ')
    .replace(/<\/li>/g, '\n')
    .replace(/\n\n\*/g, '\n*')
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '[$2]($1)')
    .replace(/\n\s+#/g, '\n#')
    .trim();

  result.episodes.push({
    title: episode.title,
    subtitle: episode.custom_elements[0]['itunes:subtitle'],
    description: description,
    slug: '',
    published_at: published_at,
    guid: episode.guid,
    duration: episode.custom_elements[3]['itunes:duration'],
    is_explicit: true,
    number: i + 1,
    artwork_file: artwork,
    audio_file: audio
  });
}

console.log(JSON.stringify(result, null, 2));
