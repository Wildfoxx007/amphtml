/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Action, AmpStoryStoreService} from '../amp-story-store-service';
import {AmpStoryAccess} from '../amp-story-access';
import {registerServiceBuilder} from '../../../../src/service';

describes.realWin('amp-story-access', {amp: true}, env => {
  let win;
  let storeService;
  let storyAccess;

  beforeEach(() => {
    win = env.win;
    storeService = new AmpStoryStoreService(win);
    registerServiceBuilder(win, 'story-store', () => storeService);

    const storyAccessEl = win.document.createElement('amp-story-access');
    storyAccessEl.getResources = () => win.services.resources.obj;

    win.document.body.appendChild(storyAccessEl);

    storyAccess = new AmpStoryAccess(storyAccessEl);
  });

  it('should append the publisher provided template in a drawer', () => {
    const publisherTemplateEl = win.document.createElement('button');
    publisherTemplateEl.classList.add('subscribe-button');
    publisherTemplateEl.innerText = 'Subscribe for $1';
    storyAccess.element.appendChild(publisherTemplateEl);

    storyAccess.buildCallback();

    // Publisher provided button is no longer a child of <amp-story-access>.
    expect(
        storyAccess.element
            .querySelector('amp-story-access > .subscribe-button')).to.be.null;

    // But has been copied in the drawer.
    const buttonInDrawerEl = storyAccess.element
        .querySelector('.i-amphtml-story-access-content > .subscribe-button');
    expect(buttonInDrawerEl).to.exist;
  });

  it('should display the <amp-story-access> tag on state update', done => {
    storyAccess.buildCallback();

    storeService.dispatch(Action.TOGGLE_ACCESS, true);

    win.requestAnimationFrame(() => {
      expect(storyAccess.element)
          .to.have.class('i-amphtml-story-access-visible');
      done();
    });
  });

  it('should whitelist the <amp-access> actions', () => {
    const addToWhitelistStub =
        sandbox.stub(storyAccess.actions_, 'addToWhitelist');

    storyAccess.buildCallback();

    expect(addToWhitelistStub).to.have.been.calledOnce;
    expect(addToWhitelistStub).to.have.been.calledWith('SCRIPT.login');
  });
});
