var tape = require('tape')
var select = require('../select')
var query = require('../query')
var Q = require('map-filter-reduce/util')

var indexes = [
  {key: 'SDR', value: ['source', 'dest', 'rel']},
  {key: 'DRS', value: ['dest', 'rel', 'source']},
  {key: 'RDS', value: ['rel', 'source', 'dest']},
]

function Query (q) {
  return query(select(indexes, q), q)
}

tape('source and dest are exact', function (t) {

  t.deepEqual(
    Query({source: 'foo', dest: 'bar'}),
    {
      gte: ['SDR', 'foo', 'bar', Q.LO],
      lt : ['SDR', 'foo', 'bar', Q.HI]
    }
  )

  t.end()
})

tape('dest exact, rel is range', function (t) {
  var query = select(indexes, {dest: 'bar', rel: {prefix: 'a'}})

  t.deepEqual(query, indexes[1])
  t.end()
})

tape('range only', function (t) {
  t.deepEqual(select(indexes, {rel: {prefix:'b'}}), indexes[2])
  t.end()
})

tape('all exact', function (t) {
  t.deepEqual(select(indexes, {source: 'foo', dest: 'bar', rel:'x' }), indexes[0])
  t.end()
})

tape('all ranges', function (t) {
  t.deepEqual(select(indexes, {source: {prefix:'f'}, dest: {prefix:'b'}}), indexes[0])
  t.end()
})

tape('all ranges except rel', function (t) {
  t.deepEqual(select(indexes, {source: {prefix:'f'}, dest: {prefix:'b'}, rel: 'x'}), indexes[2])
  t.end()
})







