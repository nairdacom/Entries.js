/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var router = new geddy.RegExpRouter();

router.get('/').to('Main.index');

// Basic routes
// router.match('/moving/pictures/:id', 'GET').to('Moving.pictures');
//
// router.match('/farewells/:farewelltype/kings/:kingid', 'GET').to('Farewells.kings');
//
// Can also match specific HTTP methods only
// router.get('/xandadu').to('Xanadu.specialHandler');
// router.del('/xandadu/:id').to('Xanadu.killItWithFire');
//
// Resource-based routes
// router.resource('hemispheres');
//
// Nested Resource-based routes
// router.resource('hemispheres').nest(function(){
//   this.resource('countries');
//   this.get('/print(.:format)').to('Hemispheres.print');
// });


router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');
router.get('/contact').to('Main.contact');

///router.get('/migrate').to('Main.dbMigrate');

router.post('/rowers/import').to('Rowers.import');

router.post('/auth/local').to('Auth.local');
router.get('/auth/twitter').to('Auth.twitter');
router.get('/auth/twitter/callback').to('Auth.twitterCallback');
router.get('/auth/facebook').to('Auth.facebook');
router.get('/auth/facebook/callback').to('Auth.facebookCallback');
router.get('/auth/yammer').to('Auth.yammer');
router.get('/auth/yammer/callback').to('Auth.yammerCallback');
router.get('/auth/google').to('Auth.google');
router.get('/auth/google/callback').to('Auth.googleCallback');

router.get('/entries/:eventId/export').to('Events.export');
router.get('/entries/:eventId/show').to('Entries.show');
router.get('/entries/:eventId/:entryId/remove').to('Entries.remove');
router.get('/entries/:eventId/:entryId/edit').to('Entries.edit');
router.get('/entries/:eventId').to('Entries.index');
router.get('/entries/:eventId/:competitionId').to('Entries.newEntry');
router.post('/entries/:eventId/:competitionId/createEntry').to('Entries.createEntry');
router.post('/entries/:eventId/:competitionId/:entryId/updateEntry').to('Entries.updateEntry');

router.get('/users/:userId/lockChange').to('Users.lockChange');
router.get('/rowers/export').to('Rowers.export');
router.get('/entries/:eventId/export').to('Events.export');

router.resource('users');
router.resource('competitions');
router.resource('events');
router.resource('rowers');
exports.router = router;
