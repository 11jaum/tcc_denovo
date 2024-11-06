import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlName, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonTabButton, IonTabBar, IonText, IonTabs, IonButtons, IonButton, IonInput, IonList, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSpinner, IonBackButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, personOutline, newspaperOutline, callOutline } from 'ionicons/icons';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service'; 
import { IonicModule } from '@ionic/angular'; // adicione essa importação
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule,
    IonContent,
    IonHeader,
     IonTitle,
      IonToolbar,
       IonIcon,
        IonTabButton,
         IonTabs,
          IonTabBar,
           CommonModule,
            FormsModule,
            IonButton,
             IonButtons,
              IonText,
               IonInput,
                IonList,
                 ReactiveFormsModule,
                  IonCard,
                   IonCardContent,
                    IonCardHeader,
                     IonCardSubtitle,
                      IonCardTitle,
                     IonSpinner,
                     RouterLink,
                    IonBackButton
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]  // adicione esta linha 
})
export class SignupPage implements OnInit {

  form!: FormGroup;
  isSignup = signal<boolean>(false);
  erroMessage = signal<string | null>(null)

  private auth = inject(AuthService);
  private router = inject(Router);
  

  constructor(private fb: FormBuilder) { 
    this.form = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]],
      Nome: ['', [Validators.required, Validators.minLength(2)]],
      cpf: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]], // validador CPF (somente números)
      Telefone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]], // validador Telefone (somente números)
    });
    
    addIcons({mailOutline, lockClosedOutline, personOutline, newspaperOutline, callOutline});
  }

  ngOnInit() {
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
    this.signup(this.form.value);
  }

  async signup(formValue: {email: string, Password: string, Nome: string, cpf: string, Telefone: string}) {
    try {
      this.setIsSignup(true);
      const { id } = await this.auth.register(formValue);

      // Navegar para a tela de tabs
      this.router.navigateByUrl('/tabs', { replaceUrl: true });

      this.setIsSignup(false);
      this.form.reset();
    } catch (e: any) {
      this.setIsSignup(false);

      let msg: string = 'Não foi possível cadastrar você, tente novamente.';
      if (e.code === 'auth/email-already-in-use') {
        msg = 'Email já está sendo usado';
      }

      this.setErroMessage(msg);
    }
  }

  setIsSignup(value: boolean) {
    this.isSignup.set(value);
  }

  setErroMessage(value: string | null) {
    this.erroMessage.set(value);
  }
}
