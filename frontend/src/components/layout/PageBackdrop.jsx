import './PageBackdrop.css'

const DOODLES = [
  {
    name: 'pencil',
    accent: 'sunny',
    paths: ['M4 20l1.2-4.4L16.3 4.5a2.1 2.1 0 0 1 3 3L8.4 18.8z', 'M14.6 6.2l3.2 3.2', 'M5.2 15.6l3.2 3.2'],
  },
  {
    name: 'ruler',
    accent: 'grape',
    paths: ['M3 16.5 16.5 3 21 7.5 7.5 21z', 'M6 13.5l1.6 1.6', 'M8.5 11l2.6 2.6', 'M11 8.5l1.6 1.6', 'M13.5 6l2.6 2.6'],
  },
  {
    name: 'book',
    accent: 'primary',
    paths: ['M2.5 5h5.5a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2.5z', 'M21.5 5H16a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h6.5z'],
  },
  {
    name: 'bulb',
    accent: 'sunny',
    paths: [
      'M12 3a6 6 0 0 0-3.9 10.6c.8.7 1.2 1.5 1.2 2.4h5.4c0-.9.4-1.7 1.2-2.4A6 6 0 0 0 12 3z',
      'M9.5 19h5',
      'M10.5 21.5h3',
    ],
  },
  {
    name: 'star',
    accent: 'coral',
    paths: ['M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6l-5.4 2.9 1.2-6-4.5-4.2 6.1-.7z'],
  },
  {
    name: 'check',
    accent: 'mint',
    paths: ['M4.5 12.5l5 5 10-11'],
  },
  {
    name: 'grade',
    accent: 'coral',
    paths: ['M3 19 7.5 5 12 19', 'M4.7 14h5.6', 'M17.5 9v6', 'M14.5 12h6'],
  },
  {
    name: 'squared',
    accent: 'primary',
    paths: ['M3 9.5l7 9.5', 'M10 9.5l-7 9.5', 'M14.5 5.2a2 2 0 0 1 3.8.7c0 1.6-3.8 2.9-3.8 4.6h4'],
  },
  {
    name: 'digits',
    accent: 'grape',
    viewBox: '0 0 36 24',
    paths: ['M5 8.5 8 6v13', 'M13.5 9a3 3 0 0 1 6 .3c0 2.6-6 5.4-6 9.7h6.3', 'M24.5 6.5h5.5l-3.4 4.8a3.6 3.6 0 1 1-2.6 6.4'],
  },
  {
    name: 'plane',
    accent: 'primary',
    paths: ['M21 3 3 10.4l7.1 3 3 7.1z', 'M10.1 13.4 21 3'],
  },
]

function PageBackdrop({ calm = false }) {
  return (
    <div className={calm ? 'page-backdrop page-backdrop--calm' : 'page-backdrop'} aria-hidden="true">
      {!calm &&
        DOODLES.map((doodle) => (
          <svg
            key={doodle.name}
            className={`page-backdrop__doodle page-backdrop__doodle--${doodle.name} accent-${doodle.accent}`}
            viewBox={doodle.viewBox || '0 0 24 24'}
          >
            {doodle.paths.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
        ))}

      <span className="page-backdrop__blob page-backdrop__blob--blue" />
      <span className="page-backdrop__blob page-backdrop__blob--sunny" />
      <span className="page-backdrop__blob page-backdrop__blob--mint" />

      {!calm && <span className="page-backdrop__dots" />}
    </div>
  )
}

export default PageBackdrop
