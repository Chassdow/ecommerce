<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\User;
use App\Entity\Adresse;
use App\Entity\UserLog;

class InscriptionController extends AbstractController
{
    #[Route('/inscription', name: 'app_inscription', methods: ['POST'])]
    public function catchData(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, TokenGeneratorInterface $tokenGenerator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $verif = true;
        //Verification côté serveur de la data ici aled =>
        
        if(strlen($data["lastname"]) < 2 || strlen($data["firstname"]) < 2){
            $verif = false;
        }
        if($verif){
        try{

            $user = new User();
            $user->setGenre($data['civilite']);
            $user->setFirstname($data['firstname']);
            $user->setLastname($data['lastname']);
            $user->setPhone($data['phone']);
            $user->setEmail($data['email']);
            $user->setBirthdate(new \Datetime($data['date']));
            $user->setCreateTime(new \DateTime());
            $user->setLastToken(new \DateTime());
            $verificationToken = $tokenGenerator->generateToken();
            $user->setAuthToken($verificationToken);
            $user->setVerifyMail(false);
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
            $user->setRoles(['ROLE_USER']);

            
            $adresse = new Adresse();
            $adresse->setAdresse($data['selectedAddress']['address']);
            $adresse->setCity($data['selectedAddress']['city']);
            $adresse->setZipcode($data['selectedAddress']['postcode']);

            $entityManager->persist($adresse);
            $entityManager->flush();

            $user->setAdresse($adresse);
            // dd($user);
            $entityManager->persist($user);
            $entityManager->flush();
            $userId = $user->getId(); 

            $userLog = new UserLog();
            $userLog->setUser($user);
            $userLog->setTime(new \DateTime());
            $userLog->setAction('inscription');
            $entityManager->persist($userLog);
            $entityManager->flush();
            // $userLog = $entityManager->getRepository(Log::class)->findOneBy(['user' => $user->getId()]);

            // $verificationUrl = $this->generateUrl('bienvenu_Route', ['token' => $verificationToken], UrlGeneratorInterface::ABSOLUTE_URL);

            // $emailHtml = $this->twig->render('email/emailSend.html.twig', [
            //     'all_Datas' => $datas,
            //     'verification_url' => $verificationUrl,
            // ]);

            // $email = (new Email())
            //     ->from('sample-sender@binaryboxtuts.com')
            //     ->to($datas['user_mail'])
            //     ->subject('Vérifiez votre email !')
            //     ->html($emailHtml);

            // $mailer->send($email);
            // return $this->render('auth/verification.html.twig', ['all_Datas' => $datas]);
        }catch(\Exception $e){
            error_log($e->getMessage());
            return new JsonResponse(['status' => 'error', 'message' => "L'adresse mail est déjà utilisée, merci d'essayer de vous connecter.","data =>" => $data], JsonResponse::HTTP_BAD_REQUEST);
            // return $this->redirectToRoute('inscription_Route');
        }
        return new JsonResponse(['status' => 'success', 'data' => [$userId,$data['firstname'],$data['lastname'],$data['email'],$user->getRoles()]], JsonResponse::HTTP_OK);
        
        }else{
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur est survenue'], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
}