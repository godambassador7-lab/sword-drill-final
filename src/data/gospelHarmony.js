/**
 * Gospel Harmony Database
 * Maps parallel passages across the four Gospels
 */

export const GOSPEL_HARMONY = [
  // ========== BIRTH & CHILDHOOD ==========
  {
    event: 'Genealogy of Jesus',
    matthew: 'Matthew 1:1-17',
    mark: null,
    luke: 'Luke 3:23-38',
    john: null,
    category: 'Birth & Childhood',
    chronology: 1
  },
  {
    event: 'Birth of Jesus',
    matthew: 'Matthew 1:18-25',
    mark: null,
    luke: 'Luke 2:1-7',
    john: null,
    category: 'Birth & Childhood',
    chronology: 2
  },
  {
    event: 'Visit of the Shepherds',
    matthew: null,
    mark: null,
    luke: 'Luke 2:8-20',
    john: null,
    category: 'Birth & Childhood',
    chronology: 3
  },
  {
    event: 'Jesus Presented at the Temple',
    matthew: null,
    mark: null,
    luke: 'Luke 2:21-40',
    john: null,
    category: 'Birth & Childhood',
    chronology: 4
  },
  {
    event: 'Visit of the Magi',
    matthew: 'Matthew 2:1-12',
    mark: null,
    luke: null,
    john: null,
    category: 'Birth & Childhood',
    chronology: 5
  },
  {
    event: 'Escape to Egypt',
    matthew: 'Matthew 2:13-18',
    mark: null,
    luke: null,
    john: null,
    category: 'Birth & Childhood',
    chronology: 6
  },
  {
    event: 'Return to Nazareth',
    matthew: 'Matthew 2:19-23',
    mark: null,
    luke: 'Luke 2:39-40',
    john: null,
    category: 'Birth & Childhood',
    chronology: 7
  },
  {
    event: 'Jesus at the Temple (Age 12)',
    matthew: null,
    mark: null,
    luke: 'Luke 2:41-52',
    john: null,
    category: 'Birth & Childhood',
    chronology: 8
  },

  // ========== BEGINNING OF MINISTRY ==========
  {
    event: 'John the Baptist Prepares the Way',
    matthew: 'Matthew 3:1-12',
    mark: 'Mark 1:1-8',
    luke: 'Luke 3:1-20',
    john: 'John 1:19-28',
    category: 'Beginning of Ministry',
    chronology: 9
  },
  {
    event: 'Baptism of Jesus',
    matthew: 'Matthew 3:13-17',
    mark: 'Mark 1:9-11',
    luke: 'Luke 3:21-22',
    john: null,
    category: 'Beginning of Ministry',
    chronology: 10
  },
  {
    event: 'Temptation of Jesus',
    matthew: 'Matthew 4:1-11',
    mark: 'Mark 1:12-13',
    luke: 'Luke 4:1-13',
    john: null,
    category: 'Beginning of Ministry',
    chronology: 11
  },
  {
    event: 'First Disciples Called',
    matthew: 'Matthew 4:18-22',
    mark: 'Mark 1:16-20',
    luke: 'Luke 5:1-11',
    john: 'John 1:35-51',
    category: 'Beginning of Ministry',
    chronology: 12,
    notes: 'John provides different context and earlier calling'
  },

  // ========== GALILEAN MINISTRY ==========
  {
    event: 'Wedding at Cana',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 2:1-11',
    category: 'Galilean Ministry',
    chronology: 13
  },
  {
    event: 'Cleansing the Temple',
    matthew: 'Matthew 21:12-13',
    mark: 'Mark 11:15-17',
    luke: 'Luke 19:45-46',
    john: 'John 2:13-25',
    category: 'Galilean Ministry / Passion Week',
    chronology: 14,
    notes: 'John places this early; Synoptics during Passion Week'
  },
  {
    event: 'Nicodemus Visits Jesus',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 3:1-21',
    category: 'Galilean Ministry',
    chronology: 15
  },
  {
    event: 'Woman at the Well',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 4:1-42',
    category: 'Galilean Ministry',
    chronology: 16
  },
  {
    event: 'Healing of the Official\'s Son',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 4:43-54',
    category: 'Galilean Ministry',
    chronology: 17
  },
  {
    event: 'Rejection at Nazareth',
    matthew: 'Matthew 13:53-58',
    mark: 'Mark 6:1-6',
    luke: 'Luke 4:16-30',
    john: null,
    category: 'Galilean Ministry',
    chronology: 18
  },
  {
    event: 'Sermon on the Mount / Plain',
    matthew: 'Matthew 5:1-7:29',
    mark: null,
    luke: 'Luke 6:20-49',
    john: null,
    category: 'Galilean Ministry',
    chronology: 19,
    notes: 'Luke has shorter version on plain; Matthew on mountain'
  },
  {
    event: 'Healing of the Centurion\'s Servant',
    matthew: 'Matthew 8:5-13',
    mark: null,
    luke: 'Luke 7:1-10',
    john: null,
    category: 'Galilean Ministry',
    chronology: 20
  },
  {
    event: 'Raising of Widow\'s Son at Nain',
    matthew: null,
    mark: null,
    luke: 'Luke 7:11-17',
    john: null,
    category: 'Galilean Ministry',
    chronology: 21
  },
  {
    event: 'Calming the Storm',
    matthew: 'Matthew 8:23-27',
    mark: 'Mark 4:35-41',
    luke: 'Luke 8:22-25',
    john: null,
    category: 'Galilean Ministry',
    chronology: 22
  },
  {
    event: 'Healing of Demon-Possessed Man (Gerasenes)',
    matthew: 'Matthew 8:28-34',
    mark: 'Mark 5:1-20',
    luke: 'Luke 8:26-39',
    john: null,
    category: 'Galilean Ministry',
    chronology: 23
  },
  {
    event: 'Healing of Woman with Bleeding / Jairus\' Daughter',
    matthew: 'Matthew 9:18-26',
    mark: 'Mark 5:21-43',
    luke: 'Luke 8:40-56',
    john: null,
    category: 'Galilean Ministry',
    chronology: 24
  },
  {
    event: 'Feeding of the 5000',
    matthew: 'Matthew 14:13-21',
    mark: 'Mark 6:30-44',
    luke: 'Luke 9:10-17',
    john: 'John 6:1-15',
    category: 'Galilean Ministry',
    chronology: 25
  },
  {
    event: 'Jesus Walks on Water',
    matthew: 'Matthew 14:22-33',
    mark: 'Mark 6:45-52',
    luke: null,
    john: 'John 6:16-21',
    category: 'Galilean Ministry',
    chronology: 26
  },
  {
    event: 'Bread of Life Discourse',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 6:22-71',
    category: 'Galilean Ministry',
    chronology: 27
  },
  {
    event: 'Peter\'s Confession of Christ',
    matthew: 'Matthew 16:13-20',
    mark: 'Mark 8:27-30',
    luke: 'Luke 9:18-21',
    john: null,
    category: 'Galilean Ministry',
    chronology: 28
  },
  {
    event: 'Transfiguration',
    matthew: 'Matthew 17:1-13',
    mark: 'Mark 9:2-13',
    luke: 'Luke 9:28-36',
    john: null,
    category: 'Galilean Ministry',
    chronology: 29
  },
  {
    event: 'Healing of Boy with Demon',
    matthew: 'Matthew 17:14-21',
    mark: 'Mark 9:14-29',
    luke: 'Luke 9:37-43',
    john: null,
    category: 'Galilean Ministry',
    chronology: 30
  },

  // ========== LATER JUDEAN & PEREAN MINISTRY ==========
  {
    event: 'Jesus at Feast of Tabernacles',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 7:1-52',
    category: 'Judean Ministry',
    chronology: 31
  },
  {
    event: 'Woman Caught in Adultery',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 8:1-11',
    category: 'Judean Ministry',
    chronology: 32
  },
  {
    event: '"I Am the Light of the World"',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 8:12-59',
    category: 'Judean Ministry',
    chronology: 33
  },
  {
    event: 'Healing of Man Born Blind',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 9:1-41',
    category: 'Judean Ministry',
    chronology: 34
  },
  {
    event: 'Good Shepherd Discourse',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 10:1-21',
    category: 'Judean Ministry',
    chronology: 35
  },
  {
    event: 'The Lord\'s Prayer Taught',
    matthew: 'Matthew 6:9-13',
    mark: null,
    luke: 'Luke 11:2-4',
    john: null,
    category: 'Perean Ministry',
    chronology: 36,
    notes: 'Different contexts and slightly different versions'
  },
  {
    event: 'Parable of the Good Samaritan',
    matthew: null,
    mark: null,
    luke: 'Luke 10:25-37',
    john: null,
    category: 'Perean Ministry',
    chronology: 37
  },
  {
    event: 'Mary and Martha',
    matthew: null,
    mark: null,
    luke: 'Luke 10:38-42',
    john: null,
    category: 'Perean Ministry',
    chronology: 38
  },
  {
    event: 'Parable of the Prodigal Son',
    matthew: null,
    mark: null,
    luke: 'Luke 15:11-32',
    john: null,
    category: 'Perean Ministry',
    chronology: 39
  },
  {
    event: 'Raising of Lazarus',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 11:1-44',
    category: 'Perean Ministry',
    chronology: 40
  },
  {
    event: 'Jesus Blesses the Children',
    matthew: 'Matthew 19:13-15',
    mark: 'Mark 10:13-16',
    luke: 'Luke 18:15-17',
    john: null,
    category: 'Perean Ministry',
    chronology: 41
  },
  {
    event: 'Rich Young Ruler',
    matthew: 'Matthew 19:16-30',
    mark: 'Mark 10:17-31',
    luke: 'Luke 18:18-30',
    john: null,
    category: 'Perean Ministry',
    chronology: 42
  },

  // ========== PASSION WEEK ==========
  {
    event: 'Triumphal Entry into Jerusalem',
    matthew: 'Matthew 21:1-11',
    mark: 'Mark 11:1-11',
    luke: 'Luke 19:28-44',
    john: 'John 12:12-19',
    category: 'Passion Week',
    chronology: 43
  },
  {
    event: 'Cursing of the Fig Tree',
    matthew: 'Matthew 21:18-22',
    mark: 'Mark 11:12-14, 20-25',
    luke: null,
    john: null,
    category: 'Passion Week',
    chronology: 44
  },
  {
    event: 'Cleansing the Temple (Second Time)',
    matthew: 'Matthew 21:12-17',
    mark: 'Mark 11:15-19',
    luke: 'Luke 19:45-48',
    john: null,
    category: 'Passion Week',
    chronology: 45
  },
  {
    event: 'The Olivet Discourse',
    matthew: 'Matthew 24:1-51',
    mark: 'Mark 13:1-37',
    luke: 'Luke 21:5-36',
    john: null,
    category: 'Passion Week',
    chronology: 46
  },
  {
    event: 'Judas Agrees to Betray Jesus',
    matthew: 'Matthew 26:14-16',
    mark: 'Mark 14:10-11',
    luke: 'Luke 22:3-6',
    john: null,
    category: 'Passion Week',
    chronology: 47
  },
  {
    event: 'The Last Supper',
    matthew: 'Matthew 26:17-30',
    mark: 'Mark 14:12-26',
    luke: 'Luke 22:7-38',
    john: 'John 13:1-30',
    category: 'Passion Week',
    chronology: 48
  },
  {
    event: 'Jesus Washes Disciples\' Feet',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 13:1-17',
    category: 'Passion Week',
    chronology: 49
  },
  {
    event: 'Upper Room Discourse',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 14:1-16:33',
    category: 'Passion Week',
    chronology: 50
  },
  {
    event: 'High Priestly Prayer',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 17:1-26',
    category: 'Passion Week',
    chronology: 51
  },
  {
    event: 'Gethsemane',
    matthew: 'Matthew 26:36-46',
    mark: 'Mark 14:32-42',
    luke: 'Luke 22:39-46',
    john: 'John 18:1',
    category: 'Passion Week',
    chronology: 52
  },
  {
    event: 'Betrayal and Arrest',
    matthew: 'Matthew 26:47-56',
    mark: 'Mark 14:43-52',
    luke: 'Luke 22:47-53',
    john: 'John 18:2-12',
    category: 'Passion Week',
    chronology: 53
  },
  {
    event: 'Trial Before the Sanhedrin',
    matthew: 'Matthew 26:57-68',
    mark: 'Mark 14:53-65',
    luke: 'Luke 22:54-55, 63-71',
    john: 'John 18:12-14, 19-24',
    category: 'Passion Week',
    chronology: 54
  },
  {
    event: 'Peter Denies Jesus',
    matthew: 'Matthew 26:69-75',
    mark: 'Mark 14:66-72',
    luke: 'Luke 22:56-62',
    john: 'John 18:15-18, 25-27',
    category: 'Passion Week',
    chronology: 55
  },
  {
    event: 'Trial Before Pilate',
    matthew: 'Matthew 27:1-2, 11-14',
    mark: 'Mark 15:1-5',
    luke: 'Luke 23:1-7',
    john: 'John 18:28-38',
    category: 'Passion Week',
    chronology: 56
  },
  {
    event: 'Jesus Before Herod',
    matthew: null,
    mark: null,
    luke: 'Luke 23:8-12',
    john: null,
    category: 'Passion Week',
    chronology: 57
  },
  {
    event: 'Pilate Delivers Jesus to Be Crucified',
    matthew: 'Matthew 27:15-26',
    mark: 'Mark 15:6-15',
    luke: 'Luke 23:13-25',
    john: 'John 18:39-19:16',
    category: 'Passion Week',
    chronology: 58
  },
  {
    event: 'Crucifixion',
    matthew: 'Matthew 27:27-56',
    mark: 'Mark 15:16-41',
    luke: 'Luke 23:26-49',
    john: 'John 19:16-37',
    category: 'Passion Week',
    chronology: 59
  },
  {
    event: 'Burial of Jesus',
    matthew: 'Matthew 27:57-61',
    mark: 'Mark 15:42-47',
    luke: 'Luke 23:50-56',
    john: 'John 19:38-42',
    category: 'Passion Week',
    chronology: 60
  },

  // ========== RESURRECTION & ASCENSION ==========
  {
    event: 'The Empty Tomb',
    matthew: 'Matthew 28:1-10',
    mark: 'Mark 16:1-8',
    luke: 'Luke 24:1-12',
    john: 'John 20:1-10',
    category: 'Resurrection',
    chronology: 61
  },
  {
    event: 'Jesus Appears to Mary Magdalene',
    matthew: null,
    mark: 'Mark 16:9-11',
    luke: null,
    john: 'John 20:11-18',
    category: 'Resurrection',
    chronology: 62
  },
  {
    event: 'Jesus Appears to Two on Road to Emmaus',
    matthew: null,
    mark: 'Mark 16:12-13',
    luke: 'Luke 24:13-35',
    john: null,
    category: 'Resurrection',
    chronology: 63
  },
  {
    event: 'Jesus Appears to the Disciples',
    matthew: null,
    mark: null,
    luke: 'Luke 24:36-43',
    john: 'John 20:19-23',
    category: 'Resurrection',
    chronology: 64
  },
  {
    event: 'Jesus and Thomas',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 20:24-29',
    category: 'Resurrection',
    chronology: 65
  },
  {
    event: 'Jesus Appears to Seven Disciples',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 21:1-14',
    category: 'Resurrection',
    chronology: 66
  },
  {
    event: 'Jesus Restores Peter',
    matthew: null,
    mark: null,
    luke: null,
    john: 'John 21:15-25',
    category: 'Resurrection',
    chronology: 67
  },
  {
    event: 'Great Commission',
    matthew: 'Matthew 28:16-20',
    mark: 'Mark 16:15-18',
    luke: null,
    john: null,
    category: 'Resurrection',
    chronology: 68
  },
  {
    event: 'Ascension',
    matthew: null,
    mark: 'Mark 16:19-20',
    luke: 'Luke 24:44-53',
    john: null,
    category: 'Resurrection',
    chronology: 69
  }
];

/**
 * Gospel-specific categories for unique content
 */
export const GOSPEL_UNIQUE_CONTENT = {
  matthew: [
    'Sermon on the Mount (chapters 5-7)',
    'Parables of the Kingdom (chapter 13)',
    'Discourse on the Church (chapter 18)',
    'Woes to Pharisees (chapter 23)'
  ],
  mark: [
    'Shortest Gospel, action-oriented',
    'Emphasis on Jesus as Suffering Servant',
    'Unique: Healing of deaf and mute man (7:31-37)',
    'Unique: Blind man at Bethsaida (8:22-26)'
  ],
  luke: [
    'Most complete birth narrative',
    'Parables unique to Luke (Good Samaritan, Prodigal Son)',
    'Emphasis on Jesus' compassion for outcasts',
    'Strong focus on prayer and Holy Spirit'
  ],
  john: [
    'Theological focus on deity of Christ',
    'Seven "I Am" statements',
    'Upper Room Discourse (chapters 14-17)',
    'Different chronology and events from Synoptics'
  ]
};

export default {
  GOSPEL_HARMONY,
  GOSPEL_UNIQUE_CONTENT
};
