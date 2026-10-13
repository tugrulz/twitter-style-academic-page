# Twitter-style Academic Page

**An academic homepage that looks and feels like a social-media profile.**
Created by **[Tuğrulcan Elmas](https://tugrulcan.com)**, Assistant Professor at the University of Edinburgh.

**Live:** [tugrulcan.com](https://tugrulcan.com) (the creator's own homepage) · **Demo of this template:** [tugrulcan.com/twitter-style-academic-page](https://tugrulcan.com/twitter-style-academic-page/)

![Preview](assets/img/share-card.jpg)

## What you get

- **A profile header:** banner, round photo, a "verified human" badge, @handle, flags, bio, stats and links.
- **Papers as posts:** each one-line summary is the post text, with the paper as a quoted card. Click a post to read the abstract and get the links.
- **Selected publications** up front, and **all publications** one click away, grouped by year and filterable by theme and type.
- **Trending in research:** your themes as hashtags that filter the list.
- **Lab:** members in a "Who to follow" sidebar, an alumni carousel, and papers by lab members shown as *their* posts, "reposted" by you.
- **Work with me as a DM:** the question types itself and your answers arrive one message at a time.
- **News, talks, media, service, teaching and side projects** as posts, with link previews and YouTube thumbnails.
- **Share** on every post: copy the link, share on X or LinkedIn, or use the phone's share sheet.
- **X-like layout:** a 275 / 600 / 350 px desktop layout, an icon menu on smaller screens, and a bottom tab bar on phones.
- **Dark mode**, keyboard and screen-reader support, and a reduced-motion setting.
- **Proper link previews:** Open Graph and X cards, plus structured data for search engines.
- **No build tools:** plain Jekyll, YAML, one CSS file and one JS file. It runs on GitHub Pages for free.

## Make it yours (5 minutes)

1. Click **Use this template → Create a new repository**. Name it `yourname.github.io` to get `https://yourname.github.io`, or use any name for a project page.
2. In the new repository, go to **Settings → Pages → Build and deployment → Source** and pick **GitHub Actions**.
3. Edit **`_config.yml`**: your name, position, affiliation, site URL and X handle.
4. Edit the files in **`_data/`**. Every file starts with a comment explaining its fields:

   | File | What it holds |
   |---|---|
   | `profile.yml` | @handle, bio, flags, links, pinned post, YouTube, course, Work with me DM, path, images |
   | `publications.yml` | papers: title, authors, venue, tldr, abstract, links, topics, `featured` |
   | `topics.yml` | research themes (the hashtags) |
   | `team.yml` | lab members and alumni (the Lab section appears when this has people) |
   | `news.yml`, `talks.yml`, `media.yml`, `service.yml`, `press.yml`, `games.yml`, `misc.yml` | everything else |

5. Replace the images in **`assets/img/`**: `avatar.png`, `banner.png` (3:1), `favicon.png` and `share-card.jpg` (1200×630, used for link previews).
6. Commit. Your site is live a minute later.

A section only appears if its file has content. Delete what you don't need.

### Preview locally (optional)

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## Credits and licence

Created by **Tuğrulcan Elmas** ([tugrulcan.com](https://tugrulcan.com) · [@DrTugrulcan](https://x.com/DrTugrulcan)).

Free to use and adapt under the [MIT licence](LICENSE). Please keep the small "Theme: Twitter-style Academic Page by Tuğrulcan Elmas" line in the footer. If you write about the template, you can cite it with [`CITATION.cff`](CITATION.cff) (GitHub's "Cite this repository" button).

Not affiliated with X Corp. "Verified human" is a joke about peer review.
