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
use App\Entity\UserLog;
use App\Entity\Adresse;

class ModificationController extends AbstractController
{
    #[Route('/modification', name: 'app_modification', methods: ['POST'])]
    public function catchData(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, TokenGeneratorInterface $tokenGenerator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $data['id']]);

        $verif = true;
        //Verification côté serveur de la data ici aled =>
        // dd($data);
        if(strlen($data["lastname"]) < 2 || strlen($data["firstname"]) < 2){
            $verif = false;
        }
        
        if($verif){
            try{
                $user->setFirstname($data['firstname']);
                $user->setLastname($data['lastname']);
                $user->setEmail($data['email']);
                $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
                $user->setPassword($hashedPassword);

                $adresse = new Adresse();
                $adresse->setAdresse($data['selectedAddress']['address']);
                $adresse->setCity($data['selectedAddress']['city']);
                $adresse->setZipcode($data['selectedAddress']['postcode']);

                $entityManager->persist($adresse);
                $entityManager->flush();

                $user->setAdresse($adresse);

                $entityManager->persist($user);
                $entityManager->flush();

                $userLog = new UserLog();
                $userLog->setUser($user);
                $userLog->setTime(new \DateTime());
                $userLog->setAction('modification profil');
                $entityManager->persist($userLog);
                $entityManager->flush();
            }catch(\Exception $e){
                error_log($e->getMessage());
                return new JsonResponse(['status' => 'error', 'message' => "L'adresse mail est déjà utilisée, merci d'essayer de vous connecter.","data =>" => $data], JsonResponse::HTTP_BAD_REQUEST);
                // return $this->redirectToRoute('inscription_Route');
            }
            $userId = $user->getId();
            $userFirstname = $user->getFirstname();
            $userLastname = $user->getLastname();
            $userEmail = $user->getEmail();
            
            return new JsonResponse(['status' => 'success', 'data' => [$userId,$userFirstname,$userLastname,$userEmail,$user->getRoles()]], JsonResponse::HTTP_OK);
        }else{
            return new JsonResponse(['status' => 'error'], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
}