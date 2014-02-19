Members.Member = DS.Model.extend({
	first_name_s: DS.attr('string'),
	last_name_s: DS.attr('string')
});

Members.Member.FIXTURES = [
  {
  	id: 1,
    first_name_s: 'Andrei',
    last_name_s: 'Silchankau'
  },
  {
    id: 2,
    first_name_s: 'Linus',
    last_name_s: 'Torvalds'
  },
  {
  	id: 3,
  	first_name_s: 'Richard',
  	last_name_s: 'Stallman'
  }
]