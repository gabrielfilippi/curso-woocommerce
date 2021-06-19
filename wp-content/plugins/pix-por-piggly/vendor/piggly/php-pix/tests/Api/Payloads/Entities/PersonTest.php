<?php
namespace Piggly\Tests\Pix\Api\Entities;

use PHPUnit\Framework\TestCase;
use Piggly\Pix\Api\Payloads\Entities\Person;

/**
 * @coversDefaultClass \Piggly\Pix\Api\Payloads\Entities\Person
 */
class PersonTest extends TestCase
{
	/**
	 * Assert if $payload is equals to $obj exported.
	 * 
	 * Anytime it runs will create 100 random unique
	 * payloads. It must assert all anytime.
	 *
	 * @covers ::import
	 * @covers ::export
	 * @dataProvider dataPersons
	 * @test Expecting positive assertion.
	 * @param array $payload
	 * @param Person $obj
	 * @return void
	 */
	public function isMatching ( array $payload, Person $obj )
	{ $this->assertEquals($payload, $obj->export()); }

	/**
	 * Assert if $actual is equals to $expected.
	 * 
	 * Anytime it runs will create 100 random unique
	 * payloads. It must assert all anytime.
	 *
	 * @covers ::setDocument
	 * @covers ::getDocumentType
	 * @dataProvider dataFormats
	 * @test Expecting positive assertion.
	 * @param mixed $expected
	 * @param mixed $actual
	 * @return void
	 */
	public function isMatchingFormat ( $expected, $actual )
	{ $this->assertEquals($expected, $actual); }

	/**
	 * A bunch of pixs to import to Person payload.
	 * Provider to isMatching() method.
	 * Generated by fakerphp.
	 * @return array
	 */
	public function dataPersons () : array
	{
		$arr = [];
		$faker = \Faker\Factory::create('pt_BR');

		for ( $i = 0; $i < 100; $i++ )
		{
			$payload = [];
			
			$array['cpf'] = $faker->cpf();
			
			// Random change to CNPJ
			if ( $faker->boolean() )
			{ $array['cnpj'] = $faker->cnpj(); unset($array['cpf']); }

			if ( $faker->boolean() )
			{ $array['nome'] = $faker->firstName().' '.$faker->lastName(); }
			
			if ( $faker->boolean() )
			{ $array['nomeFantasia'] = $faker->company(); }
			
			if ( $faker->boolean() )
			{ $array['cidade'] = $faker->city(); }
			
			if ( $faker->boolean() )
			{ $array['uf'] = $faker->stateAbbr(); }
			
			if ( $faker->boolean() )
			{ $array['logradouro'] = $faker->streetAddress(); }
			
			if ( $faker->boolean() )
			{ $array['cep'] = $faker->postcode(); }
			
			if ( $faker->boolean() )
			{ $array['email'] = $faker->email(); }

			$arr[] = [ $payload, (new Person())->import($payload) ];
		}

		return $arr;
	}

	/**
	 * A bunch of persons to validate data.
	 * Provider to isMatchingFormat() method.
	 * Generated by fakerphp.
	 * @return array
	 */
	public function dataFormats () : array
	{
		$arr = [];
		$faker = \Faker\Factory::create('pt_BR');

		for ( $i = 0; $i < 100; $i++ )
		{
			$doc = null;
			$docType = null;

			if ( $faker->boolean() )
			{ $doc = $faker->cpf(); $docType = 'cpf'; }
			else
			{ $doc = $faker->cnpj(); $docType = 'cnpj'; }

			$person = new Person();
			$person->setDocument($doc);

			$arr[] = [ $docType, $person->getDocumentType() ];
		}

		return $arr;
	}
}