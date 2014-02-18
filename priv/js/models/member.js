Members.Member = DS.Model.extend({
	first_name: DS.attr('string'),
	last_name: DS.attr('string')
	
});

Members.Member.FIXTURES = [
  {
  	id: 1,
    first_name: 'Andrei',
    last_name: 'Silchankau'
  },
  {
    id: 2,
    first_name: 'Linus',
    last_name: 'Torvalds'
  },
  {
  	id: 3,
  	first_name: 'Richard',
  	last_name: 'Stallman'
  }
]