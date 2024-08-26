import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  signal,
} from '@angular/core';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent {
  showSplashScreen = signal(true);
  ngOnInit() {
    setTimeout(() => {
      this.showSplashScreen.set(false);
    }, 4000);
  }
}
